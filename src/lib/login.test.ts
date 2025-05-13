import { expect, test } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const wikipediaUsername = process.env.WIKIPEDIA_USERNAME;
const wikipediaPassword = process.env.WIKIPEDIA_PASSWORD;

const authFile = 'src/auth/login.json';

/**
 * Manually create a Wikipedia account and then finish this test
 * so that it signs into Wikipedia and captures the logged-in
 * session to src/auth/login.json, so that the tests in all.test.ts
 * run as a signed in user.
 */

test('Sign in to Wikipedia', async ({ page }) => {
    await page.goto('https://en.wikipedia.org/w/index.php?title=Special:UserLogin');
    if (!wikipediaUsername || !wikipediaPassword) {
        throw new Error(`Need a username and password to sign in!`);
    }

    const userName = await page.getByLabel('Username');
    const password = await page.getByLabel('Password');

    await expect(userName).toBeVisible();
    await expect(password).toBeVisible(); 

    await userName.fill(wikipediaUsername);
    await password.fill(wikipediaPassword);

    const loginButton= await page.getByRole('button', { name: 'Log in' });

    await expect(loginButton).toBeVisible();
    await expect(loginButton).toBeEnabled();

    await loginButton.click();
    
    await page.context().storageState({ path: authFile });
    });