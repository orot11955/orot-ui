import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';

const baseURL = 'http://127.0.0.1:4173';

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

async function openControlledExample(page) {
  await page.goto(`${baseURL}/components/markdown-editor`);
  await page.getByRole('heading', { name: 'MarkdownEditor', exact: true }).waitFor();

  const example = page.locator('.example', {
    hasText: '제어 모드',
  }).first();
  const editor = example.locator('.orot-md-content').first();
  const output = example.locator('pre').first();

  await editor.click();

  return { example, editor, output };
}

async function selectEditorText(editor, needle) {
  const handle = await editor.elementHandle();
  if (!handle) {
    throw new Error('Editor handle not found.');
  }

  await editor.page().evaluate(({ node, text }) => {
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let targetNode = null;

    while (walker.nextNode()) {
      const current = walker.currentNode.textContent ?? '';
      if (current.includes(text)) {
        targetNode = walker.currentNode;
        break;
      }
    }

    if (!targetNode) {
      throw new Error(`Could not find text "${text}" inside editor.`);
    }

    const content = targetNode.textContent ?? '';
    const start = content.indexOf(text);
    const end = start + text.length;
    const range = document.createRange();
    range.setStart(targetNode, start);
    range.setEnd(targetNode, end);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, { node: handle, text: needle });
}

const browser = await chromium.launch({ headless: true });

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });

  {
    const { output, editor } = await openControlledExample(page);
    await selectEditorText(editor, '수정해');
    await page.keyboard.press('Enter');

    const text = await waitFor(async () => {
      const value = await output.textContent();
      if (value?.includes('내용을 \n 보세요!') && !value.includes('수정해')) {
        return value;
      }
      return null;
    });

    assert.ok(
      text,
      `Enter should replace the selection with a hard line break. Current text: ${await output.textContent()}`,
    );
  }

  {
    const { output, editor } = await openControlledExample(page);
    await selectEditorText(editor, '수정해');
    await page.keyboard.press('Shift+Enter');

    const text = await waitFor(async () => {
      const value = await output.textContent();
      if (value?.includes('내용을 \n 보세요!') && !value.includes('수정해')) {
        return value;
      }
      return null;
    });

    assert.ok(
      text,
      `Shift+Enter should replace the selection with a soft line break. Current text: ${await output.textContent()}`,
    );
  }

  {
    const { output, editor, example } = await openControlledExample(page);
    await selectEditorText(editor, '수정해');
    await example.getByRole('button', { name: 'Insert table' }).click();

    const text = await waitFor(async () => {
      const value = await output.textContent();
      if (
        value?.includes('| Column 1 | Column 2 | Column 3 |') &&
        !value.includes('수정해')
      ) {
        return value;
      }
      return null;
    });

    assert.ok(
      text,
      `Insert table should replace the current selection cleanly. Current text: ${await output.textContent()}`,
    );
  }

  console.log(JSON.stringify({
    checks: [
      'Enter replaces a non-collapsed selection with a line break',
      'Shift+Enter replaces a non-collapsed selection with a soft line break',
      'Toolbar insertion replaces the current selection without leaving stale text',
    ],
  }, null, 2));
} finally {
  await browser.close();
}
