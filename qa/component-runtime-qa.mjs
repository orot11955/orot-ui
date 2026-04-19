import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';

const baseURL = 'http://127.0.0.1:4173';
const artifactDir = path.resolve(process.cwd(), '../prompt/qa_report/qa_assets/2026-04-11');

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

const require = createRequire(import.meta.url);
const { chromium } = require(findPlaywrightPackage());

function recordResult(results, name, status, details = {}) {
  results.push({
    name,
    status,
    ...details,
  });
}

async function waitForText(page, locator, text, timeout = 3000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeout) {
    const currentText = await locator.textContent();
    if (currentText?.includes(text)) {
      return;
    }
    await page.waitForTimeout(100);
  }

  const currentText = await locator.textContent();
  throw new Error(`Timed out waiting for text "${text}". Current text: ${currentText ?? '<empty>'}`);
}

function example(page, title) {
  return page.locator('.example', { hasText: title }).first();
}

async function saveScreenshot(page, fileName) {
  await page.screenshot({
    path: path.join(artifactDir, fileName),
    fullPage: true,
  });
}

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8k6QAAAAASUVORK5CYII=',
  'base64'
);

const browser = await chromium.launch({
  headless: true,
});

const results = [];

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();

  try {
    await page.goto(`${baseURL}/components/form`);
    await page.getByRole('heading', { name: 'Form', exact: true }).waitFor();
    await page.evaluate(() => {
      window.__orotLastAlert = null;
      window.alert = (message) => {
        window.__orotLastAlert = String(message);
      };
    });

    const verticalExample = example(page, 'Vertical (기본)');
    await verticalExample.getByPlaceholder('Enter username').fill('alice');
    await verticalExample.getByPlaceholder('Enter email').fill('alice@example.com');

    await verticalExample.getByRole('combobox').click();
    await verticalExample.getByRole('option', { name: 'Admin' }).click();

    await verticalExample.getByRole('button', { name: 'Submit' }).click();
    await page.waitForFunction(() => Boolean(window.__orotLastAlert));
    const values = JSON.parse(await page.evaluate(() => window.__orotLastAlert));

    assert.deepEqual(values, {
      username: 'alice',
      email: 'alice@example.com',
      role: 'admin',
    });

    await saveScreenshot(page, 'form-runtime.png');
    recordResult(results, 'Form', 'pass', {
      checks: ['onFinish submit', 'Form rules/value binding', 'Select field binding'],
      screenshot: 'form-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Form', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/table`);
    await page.getByRole('heading', { name: 'Table' }).waitFor();

    const rowSelectionExample = example(page, 'Row Selection');
    const firstRowCheckbox = rowSelectionExample
      .locator('tbody .orot-table__row')
      .first()
      .locator('input[type="checkbox"]');

    await firstRowCheckbox.click();
    await waitForText(page, rowSelectionExample, 'Selected: 1');

    await firstRowCheckbox.click();
    await waitForText(page, rowSelectionExample, 'Selected: none');

    const paginationExample = example(page, 'Pagination');
    await waitForText(page, paginationExample.locator('tbody'), 'Alice');
    await paginationExample.getByRole('button', { name: '2' }).click();
    await waitForText(page, paginationExample.locator('tbody'), 'Carol');

    const paginationBody = await paginationExample.locator('tbody').textContent();
    assert.ok(!paginationBody?.includes('Alice'), 'Page 2 should not contain Alice');

    const fixedExample = example(page, 'Scroll + Fixed Columns');
    const scrollContainer = fixedExample.locator('.orot-table__scroll');

    await scrollContainer.evaluate((element) => {
      element.scrollLeft = 240;
    });
    await page.waitForTimeout(150);

    const containerBox = await scrollContainer.boundingBox();
    const firstFixedCell = await fixedExample.locator('tbody tr').first().locator('td').nth(0).boundingBox();
    const lastFixedCell = await fixedExample.locator('tbody tr').first().locator('td').nth(3).boundingBox();

    assert.ok(containerBox, 'Table scroll container should have a bounding box');
    assert.ok(firstFixedCell, 'Left fixed cell should have a bounding box');
    assert.ok(lastFixedCell, 'Right fixed cell should have a bounding box');
    assert.ok((firstFixedCell.x + 1) >= containerBox.x, 'Left fixed column should remain visible after horizontal scroll');
    assert.ok(
      (lastFixedCell.x + lastFixedCell.width) <= (containerBox.x + containerBox.width + 1),
      'Right fixed column should remain visible after horizontal scroll'
    );

    await saveScreenshot(page, 'table-runtime.png');
    recordResult(results, 'Table', 'pass', {
      checks: ['Controlled rowSelection', 'Pagination render and page change', 'Fixed columns on horizontal scroll'],
      screenshot: 'table-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Table', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/select`);
    await page.getByRole('heading', { name: 'Select' }).waitFor();

    const multipleSearchableExample = example(page, 'Multiple + Search');
    await multipleSearchableExample.getByRole('combobox').click();
    await multipleSearchableExample.locator('.orot-select__search').fill('cher');

    await multipleSearchableExample.getByRole('option', { name: 'Cherry' }).waitFor();
    const appleCount = await multipleSearchableExample.getByRole('option', { name: 'Apple' }).count();
    assert.equal(appleCount, 0, 'Search should filter out non-matching options');

    await multipleSearchableExample.getByRole('option', { name: 'Cherry' }).click();
    await waitForText(page, multipleSearchableExample.locator('.orot-select__tag'), 'Cherry');

    await saveScreenshot(page, 'select-runtime.png');
    recordResult(results, 'Select', 'pass', {
      checks: ['mode=multiple', 'showSearch filter', 'Selected tag render'],
      screenshot: 'select-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Select', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/menu`);
    await page.getByRole('heading', { name: 'Menu' }).waitFor();

    const verticalExample = example(page, 'Vertical (기본)');
    await verticalExample.getByText('Recent', { exact: true }).click();
    await waitForText(page, verticalExample, 'Last keyPath: 2-1 > 2');

    await saveScreenshot(page, 'menu-runtime.png');
    recordResult(results, 'Menu', 'pass', {
      checks: ['Nested menu click', 'keyPath render'],
      screenshot: 'menu-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Menu', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/modal`);
    await page.getByRole('heading', { name: 'Modal', exact: true }).waitFor();

    const destroyExample = example(page, 'Destroy On Hidden');
    const openButton = destroyExample.getByRole('button', { name: 'Destroy On Hidden' }).first();

    await openButton.click();
    let dialog = page.locator('.orot-modal-overlay:not([hidden]) .orot-modal').first();
    await dialog.waitFor();

    await dialog.locator('input').fill('Updated draft');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await dialog.waitFor({ state: 'hidden' });

    await openButton.click();
    dialog = page.locator('.orot-modal-overlay:not([hidden]) .orot-modal').first();
    await dialog.waitFor();
    const reopenedValue = await dialog.locator('input').inputValue();

    assert.equal(reopenedValue, 'Draft text');

    await saveScreenshot(page, 'modal-runtime.png');
    recordResult(results, 'Modal', 'pass', {
      checks: ['destroyOnHidden unmount', 'Reopen reset state'],
      screenshot: 'modal-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Modal', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/splitter`);
    await page.getByRole('heading', { name: 'Splitter', exact: true }).waitFor();

    const horizontalExample = example(page, '수평 분할 (horizontal)');
    const divider = horizontalExample.locator('.orot-splitter__divider').first();
    const panels = horizontalExample.locator('.orot-splitter__panel');

    const beforeWidth = await panels.nth(0).boundingBox();
    const beforeStyle = await panels.nth(0).getAttribute('style');
    const dividerBox = await divider.boundingBox();
    assert.ok(beforeWidth, 'Splitter first panel should have a bounding box');
    assert.ok(dividerBox, 'Splitter divider should have a bounding box');

    await divider.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const startX = rect.x + rect.width / 2;
      const startY = rect.y + rect.height / 2;
      element.dispatchEvent(new MouseEvent('mousedown', {
        clientX: startX,
        clientY: startY,
        bubbles: true,
      }));
      document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: startX + 120,
        clientY: startY,
        bubbles: true,
      }));
      document.dispatchEvent(new MouseEvent('mouseup', {
        clientX: startX + 120,
        clientY: startY,
        bubbles: true,
      }));
    });
    await page.waitForTimeout(100);

    const afterWidth = await panels.nth(0).boundingBox();
    const afterStyle = await panels.nth(0).getAttribute('style');
    assert.ok(afterWidth, 'Splitter first panel should still have a bounding box after resize');
    assert.ok(
      Math.abs((afterWidth?.width ?? 0) - (beforeWidth?.width ?? 0)) > 8 || beforeStyle !== afterStyle,
      'Dragging divider should resize the first panel width'
    );

    const verticalExample = example(page, '수직 분할 (vertical)');
    const verticalPanels = verticalExample.locator('.orot-splitter__panel');
    const firstVerticalPanel = await verticalPanels.nth(0).boundingBox();
    const secondVerticalPanel = await verticalPanels.nth(1).boundingBox();
    assert.ok(firstVerticalPanel, 'Vertical splitter first panel should have a bounding box');
    assert.ok(secondVerticalPanel, 'Vertical splitter second panel should have a bounding box');
    assert.ok(
      (secondVerticalPanel?.y ?? 0) > ((firstVerticalPanel?.y ?? 0) + (firstVerticalPanel?.height ?? 0) - 2),
      'orientation="vertical" panels should stack top-to-bottom'
    );

    await saveScreenshot(page, 'splitter-runtime.png');
    recordResult(results, 'Splitter', 'pass', {
      checks: ['Divider drag resize', 'orientation=vertical layout'],
      screenshot: 'splitter-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'Splitter', 'fail', { error: String(error) });
  }

  try {
    await page.goto(`${baseURL}/components/markdown-editor`);
    await page.getByRole('heading', { name: 'MarkdownEditor', exact: true }).waitFor();

    const uploadExample = example(page, '비동기 이미지 업로드 (순서 유지)');
    const [fileChooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      uploadExample.getByRole('button', { name: 'Insert image' }).click(),
    ]);

    await fileChooser.setFiles([
      { name: 'first-slow.png', mimeType: 'image/png', buffer: PNG_1X1 },
      { name: 'second-fast.png', mimeType: 'image/png', buffer: PNG_1X1 },
    ]);

    const uploadOutput = uploadExample.locator('[data-qa="markdown-upload-output"]');
    const uploadOutputHandle = await uploadOutput.elementHandle();
    assert.ok(uploadOutputHandle, 'Upload output element should exist');
    await page.waitForFunction(
      (element) => {
        const text = element?.textContent ?? '';
        return (
          text.includes('first-slow.png') &&
          text.includes('second-fast.png') &&
          text.includes('data:image/svg+xml') &&
          !text.includes('blob:')
        );
      },
      uploadOutputHandle,
    );

    const outputText = await uploadOutput.textContent();
    assert.ok(outputText, 'Upload output should render the final markdown text');
    assert.ok(
      outputText.indexOf('first-slow.png') < outputText.indexOf('second-fast.png'),
      'Inserted image markdown should preserve the original file order'
    );

    const uploadPreviewImages = uploadExample.locator('.orot-md-image-preview__img');
    await waitForText(page, uploadOutput, 'data:image/svg+xml');
    assert.equal(
      await uploadPreviewImages.count(),
      2,
      'Async upload example should render two uploaded preview images'
    );

    await saveScreenshot(page, 'markdown-editor-runtime.png');
    recordResult(results, 'MarkdownEditor', 'pass', {
      checks: [
        'Multiple file input upload',
        'Upload completion order does not reorder markdown',
        'Temporary blob URLs replaced by final URLs',
      ],
      screenshot: 'markdown-editor-runtime.png',
    });
  } catch (error) {
    recordResult(results, 'MarkdownEditor', 'fail', { error: String(error) });
  }

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
  });
  const mobilePage = await mobileContext.newPage();

  try {
    await mobilePage.goto(`${baseURL}/components/grid`);
    await mobilePage.getByRole('heading', { name: 'Grid' }).waitFor();

    const responsiveExample = example(mobilePage, '반응형');
    const cells = responsiveExample.locator('.grid-cell');
    const count = await cells.count();
    assert.equal(count, 4, 'Responsive example should render 4 cells');

    const firstBox = await cells.nth(0).boundingBox();
    const secondBox = await cells.nth(1).boundingBox();

    assert.ok(firstBox, 'First grid cell should have a bounding box');
    assert.ok(secondBox, 'Second grid cell should have a bounding box');
    assert.ok(
      (secondBox.y - firstBox.y) > (firstBox.height - 1),
      'On mobile viewport, xs=24 columns should stack vertically'
    );
    assert.ok(
      Math.abs(secondBox.x - firstBox.x) < 4,
      'Stacked columns should align to the same left edge'
    );

    await saveScreenshot(mobilePage, 'grid-runtime-mobile.png');
    recordResult(results, 'Grid', 'pass', {
      checks: ['xs responsive layout', 'Mobile stacked columns'],
      screenshot: 'grid-runtime-mobile.png',
    });
  } catch (error) {
    recordResult(results, 'Grid', 'fail', { error: String(error) });
  } finally {
    await mobileContext.close();
  }

  await context.close();
} finally {
  await browser.close();
  fs.writeFileSync(
    path.join(artifactDir, 'component-runtime-qa-results.json'),
    JSON.stringify(
      {
        date: '2026-04-11',
        baseURL,
        results,
      },
      null,
      2
    )
  );
}

const failed = results.filter((result) => result.status === 'fail');

if (failed.length > 0) {
  console.error(JSON.stringify({ failed }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ results }, null, 2));
