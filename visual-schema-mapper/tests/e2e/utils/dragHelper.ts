import { Page } from '@playwright/test';

export async function drag(
  page: Page,
  sourceSelector: string,
  targetSelector: string
): Promise<void> {
  const source = page.locator(sourceSelector);
  const target = page.locator(targetSelector);

  await source.hover();
  await page.mouse.down();
  const targetBox = await target.boundingBox();

  if (!targetBox) {
    throw new Error(`Target element not found for selector: ${targetSelector}`);
  }

  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, {
    steps: 5,
  });
  await page.mouse.up();
}
