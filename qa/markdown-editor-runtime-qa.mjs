import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const baseURL = 'http://127.0.0.1:4173';
const artifactDir = path.resolve(process.cwd(), '../prompt/qa_report/qa_assets/2026-04-20');

fs.mkdirSync(artifactDir, { recursive: true });

function findPlaywrightPackage() {
  const npxRoot = path.join(os.homedir(), '.npm', '_npx');
  if (!fs.existsSync(npxRoot)) {
    throw new Error(`Playwright cache directory not found: ${npxRoot}`);
  }

  for (const entry of fs.readdirSync(npxRoot)) {
    const candidate = path.join(npxRoot, entry, 'node_modules', 'playwright');
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error('Cached playwright package not found under ~/.npm/_npx');
}

async function waitFor(predicate, timeout = 8000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    const result = await predicate();
    if (result) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, 120));
  }

  return null;
}

const require = createRequire(import.meta.url);
const { chromium } = require(findPlaywrightPackage());

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8k6QAAAAASUVORK5CYII=',
  'base64',
);

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });

  await page.goto(`${baseURL}/components/markdown-editor`);
  await page.getByRole('heading', { name: 'MarkdownEditor', exact: true }).waitFor();

  const uploadExample = page.locator('.example', {
    hasText: '비동기 이미지 업로드 (순서 유지)',
  }).first();
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    uploadExample.getByRole('button', { name: 'Insert image' }).click(),
  ]);

  await fileChooser.setFiles([
    { name: 'first-slow.png', mimeType: 'image/png', buffer: PNG_1X1 },
    { name: 'second-fast.png', mimeType: 'image/png', buffer: PNG_1X1 },
  ]);

  const uploadOutput = uploadExample.locator('[data-qa="markdown-upload-output"]');
  const finalText = await waitFor(async () => {
    const text = await uploadOutput.textContent();
    if (
      text?.includes('first-slow.png') &&
      text.includes('second-fast.png') &&
      text.includes('data:image/svg+xml') &&
      !text.includes('blob:')
    ) {
      return text;
    }
    return null;
  });

  const currentText = finalText ?? await uploadOutput.textContent();
  assert.ok(
    finalText,
    `Uploaded markdown should be replaced with final URLs. Current text: ${currentText ?? '<empty>'}`,
  );
  assert.ok(
    finalText.indexOf('first-slow.png') < finalText.indexOf('second-fast.png'),
    'Uploaded markdown should preserve insertion order',
  );

  const previewImages = uploadExample.locator('.orot-md-image-preview__img');
  await waitFor(async () => ((await previewImages.count()) === 2 ? true : null));
  assert.equal(await previewImages.count(), 2, 'Two uploaded images should be rendered');

  const loadedImage = await waitFor(async () => {
    return previewImages.nth(0).evaluate((node) => {
      if (!(node instanceof HTMLImageElement)) return null;
      if (!node.complete || !node.currentSrc.startsWith('data:image/svg+xml')) {
        return null;
      }

      return {
        width: node.naturalWidth,
        height: node.naturalHeight,
      };
    });
  });

  assert.deepEqual(
    loadedImage,
    { width: 480, height: 270 },
    'Final uploaded preview should load with the expected intrinsic size',
  );

  const editor = uploadExample.locator('.orot-md-content');
  await editor.click();
  await page.keyboard.type(' cache');

  const sizeAttrs = await waitFor(async () => {
    const width = await previewImages.nth(0).getAttribute('width');
    const height = await previewImages.nth(0).getAttribute('height');
    if (width && height) {
      return { width, height };
    }
    return null;
  });

  assert.deepEqual(
    sizeAttrs,
    { width: '480', height: '270' },
    'Measured image dimensions should be cached and applied on rerender',
  );

  await page.screenshot({
    path: path.join(artifactDir, 'markdown-editor-runtime.png'),
    fullPage: true,
  });

  console.log(JSON.stringify({
    checks: [
      'parallel upload completion with stable insertion order',
      'temporary blob URLs replaced by final URLs',
      'cached image dimensions applied after rerender',
    ],
    screenshot: 'markdown-editor-runtime.png',
  }, null, 2));
} finally {
  await browser.close();
}
