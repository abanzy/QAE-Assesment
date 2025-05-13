import { Page, expect, Locator } from '@playwright/test';

/**
 * This test was generated using Ranger's test recording tool. The test is supposed to:
 * 1. Navigate to Wikipedia's homepage
 * 2. Assert there are less than 7,000,000 articles in English
 * 3. Assert the page's text gets smaller when the 'Small' text size option is selected
 * 4. Assert the page's text gets larger when the 'Large' text size option is selected
 * 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected
 *
 * Instructions: Run the test and ensure it performs all steps described above
 *
 * Good luck!
 */
export async function run(page: Page, params: {}) {
    /** STEP: 1. Navigate to Wikipedia's homepage */
    await page.goto('https://en.wikipedia.org/wiki/Main_Page');

    /** STEP: 2. Assert there are less than 7,000,000 articles in English */
    const totalArticlesLink = page.getByTitle('Special:Statistics').nth(1)
    await expect(totalArticlesLink).toBeVisible();
    await assertEnglishArticlesCountAndLanguage(totalArticlesLink);

    /** STEP: 3. Assert the page's text gets smaller when the 'Small' text size option is selected */
    const welcomeText = await page.getByRole('heading', { name: 'Welcome to Wikipedia' });
    await expect(welcomeText).toBeVisible();
    const baseFontSize = await welcomeText.evaluate(el => getComputedStyle(el).fontSize);

    const smallTextSizeOption = page.getByRole('radio', { name: 'Small' });
    await selectAndVerifyRadioButton(smallTextSizeOption);

    const smallerFontSize = await welcomeText.evaluate(el => getComputedStyle(el).fontSize);
    await expect(Number(smallerFontSize.replace('px', ''))).toBeLessThan(Number(baseFontSize.replace('px', '')));

    /** STEP: 4. Assert the page's text gets larger when the 'Large' text size option is selected */
    const largeTextSizeOption = page.getByRole('radio', { name: 'Large' });
    await selectAndVerifyRadioButton(largeTextSizeOption);

    const largerFontSize = await welcomeText.evaluate(el => getComputedStyle(el).fontSize);
    await expect(Number(largerFontSize.replace('px', ''))).toBeGreaterThan(Number(baseFontSize.replace('px', '')));

    /** STEP: 5. Assert the page's text goes back to the default size when the 'Standard' text size option is selected */
    const standardTextSizeButton = page.getByLabel('Standard').first();
    await selectAndVerifyRadioButton(standardTextSizeButton);

    const standardFontSize = await welcomeText.evaluate(el => getComputedStyle(el).fontSize);
    await expect(Number(standardFontSize.replace('px', ''))).toEqual(Number(baseFontSize.replace('px', '')));
}
async function assertEnglishArticlesCountAndLanguage(link: any) {
    const text = await link.textContent();
    const value = text?.replace(/,/g, '').replace(/\D/g, '');
    await expect(Number(value)).toBeLessThan(7000000);

    const parentLiText = await link.locator('..').textContent();
    await expect(parentLiText).toContain('articles in English');
}
async function selectAndVerifyRadioButton(radioButton: Locator,) {
  await expect(radioButton).toBeVisible();
  await expect(radioButton).toBeEnabled();
  await radioButton.click();
  await expect(radioButton).toBeChecked();
}