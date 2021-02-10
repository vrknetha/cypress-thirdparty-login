const { chromium } = require('playwright');

async function launchChromium() {
    return await chromium.launch({
        headless: false,
        args: [
            '--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-dev-shm-usage',
			'--ignore-certificate-errors',
			'--unsafely-treat-insecure-origin-as-secure=https://localhost:4200/',
			'--disable-notifications'
        ]
    })
}

async function loginToFacebook (page, username, password) {
    if (!username || !password) {
		throw new Error('Username or Password missing for login');
	}
    await page.waitForSelector(`#email`);
	await page.fill(`#email`, username);
	await page.fill(`#pass`, password);
	return await page.click(`#loginbutton`);
}

async function getLocalStorageData(page) {
    return await page.evaluate(() => {
      return Object.keys(localStorage).reduce(
          (items, curr) => ({
            ...items,
            [curr]: localStorage.getItem(curr)
          }),
          {}
      )
    });
  }

async function getSessionStorageData(page) {
    return page.evaluate(() => {
      return Object.keys(sessionStorage).reduce(
          (items, curr) => ({
           ...items,
           [curr]: sessionStorage.getItem(curr)
          }),
          {}
      )
    })
  } 


module.exports = {
    GetSession: async function (username, password, url) {
        const browser = await launchChromium();
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url);
        await loginToFacebook(page, username, password);
        await page.waitForNavigation({
            waitUntil: `networkidle`
        });
        const cookies = await context.cookies();
        const lsd = await getLocalStorageData(page);
        const ssd = await getSessionStorageData(page);
        return {
            cookies, lsd, ssd
        }
    }
}

