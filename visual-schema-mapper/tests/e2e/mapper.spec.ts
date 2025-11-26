/// <reference types="node" />

import { expect, test } from '@playwright/test'
import { drag } from './utils/dragHelper'

const APP_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173/'

const sourceFieldSelector = (fieldId: string) => `[data-testid="source-${fieldId}"]`

const targetSlotSelector = (targetId: string) => `[data-testid="target-${targetId}"]`

test.beforeEach(async ({ page }) => {
  await page.goto(APP_URL)
})

test('Happy Path Mapping', async ({ page }) => {
  const sourceSelector = sourceFieldSelector('p_id')
  const eanSlotSelector = targetSlotSelector('ean')

  await drag(page, sourceSelector, eanSlotSelector)

  const eanSlot = page.locator(eanSlotSelector)
  await expect(eanSlot).toContainText('p_id')

  const saveButton = page.getByRole('button', { name: /save/i })
  await expect(saveButton).toBeEnabled()
})

test('Validation Error (The Tradebyte Feature)', async ({ page }) => {
  const sourceSelector = sourceFieldSelector('p_id')
  const priceSlotSelector = targetSlotSelector('price')

  await drag(page, sourceSelector, priceSlotSelector)

  const priceSlot = page.locator(priceSlotSelector)
  await expect(priceSlot).toContainText(/Drop here/i)
  await expect(priceSlot).not.toContainText('p_id')
  await expect(priceSlot).toHaveClass(/border-red-500/)
})
