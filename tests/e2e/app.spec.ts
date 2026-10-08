import { expect, test } from '@playwright/test';

test('searches fixtures and opens a record with tags', async ({ page }) => {
  await page.route('**/record/search?*', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        totalCount: 1,
        entities: [
          {
            id: 42,
            title: 'Firearms report',
            recordType: 'WANGJO',
            year: 1600,
            month: 4,
            day: 3,
            content: 'A record mentioning 火藥.',
            edited: false,
          },
        ],
      }),
    });
  });
  await page.route('**/record/id/42', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        id: 42,
        title: 'Firearms report',
        recordType: 'WANGJO',
        year: 1600,
        content: 'A record mentioning 火藥.',
        edited: false,
      }),
    });
  });
  await page.route('**/tag/record/42', async (route) => {
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 1,
          recordId: 42,
          recordType: 'WANGJO',
          tagName: 'Subject',
          tagContent: '火藥',
        },
      ]),
    });
  });

  await page.goto('/search');
  await page.getByPlaceholder(/for example/i).fill('火藥');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: /search records/i }).click();

  await expect(page.getByRole('heading', { name: /1 records/i })).toBeVisible();
  await page.getByRole('link', { name: /open record/i }).click();
  await expect(page.getByRole('heading', { name: 'Firearms report' })).toBeVisible();
  await expect(page.getByRole('link', { name: '火藥' })).toHaveAttribute('href', '/tag/%E7%81%AB%E8%97%A5');
});

test('renders aggregation charts from deterministic fixtures', async ({ page }) => {
  await page.route('**/record/aggregation**', async (route) => {
    const request = route.request();
    if (request.method() === 'GET') {
      await route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([
          { year: 1600, count: 20 },
          { year: 1601, count: 25 },
        ]),
      });
      return;
    }
    await route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify([
        { year: 1600, count: 2 },
        { year: 1601, count: 3 },
      ]),
    });
  });

  await page.goto('/aggregation');
  await page.getByPlaceholder(/for example/i).fill('鳥銃');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.getByRole('button', { name: /graph trends/i }).click();

  await expect(page.getByRole('heading', { name: 'Keyword matches' })).toBeVisible();
  await expect(page.getByText('View accessible chart data').first()).toBeVisible();
});

test('fits desktop, tablet, and mobile viewports', async ({ page }, testInfo) => {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto('/search');
    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
    await page.screenshot({
      path: testInfo.outputPath(`${viewport.name}.png`),
      fullPage: true,
    });
  }
});

test('supports deep links and mobile navigation', async ({ page }) => {
  await page.goto('/search/instruction');
  await expect(page.getByRole('heading', { name: /how to search/i })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/about');
  await page.getByRole('button', { name: /toggle navigation/i }).click();
  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible();

  await page.goto('/not-a-real-route');
  await expect(page.getByRole('heading', { name: /outside the archive/i })).toBeVisible();
});
