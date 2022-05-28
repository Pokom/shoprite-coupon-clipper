const { firefox } = require('playwright');

require('dotenv').config()

const { EMAIL: email = "", PASSWORD: password = "", HEADLESS: headless = "true" } = process.env;

if (email.length === 0 || password.length === 0) {
    console.error("Username and password must be set.");
    process.exit(1);
}

(async () => {
    console.log(`Attempting to clip coupons for ${email}`)
    const browser = await firefox.launch({ headless: headless === "true" });
    const context = await browser.newContext({
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36"
    })
    const page = await context.newPage();
    await page.goto('https://coupons.shoprite.com');
    await page.click('.login-to-load')
    await page.fill('input[name="Email"]', email);
    await page.fill('input[name="Password"]', password);
    await page.click('#SignIn');
    await page.click('"Show All"')
    const coupons = await page.$$('.available-to-clip')
    for await (const coupon of coupons) {
        await coupon.click({ timeout: 500 }).catch(console.error);
        await page.click('"Ok"', { timeout: 1000 }).catch(console.error);
    }
    await browser.close();
})().catch(error => {
    console.error(error);
    process.exit(1);
});
