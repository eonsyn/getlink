const puppeteer = require("puppeteer");
const scrapdata = async () => {
  let browser = null;

  try {
    const browser = await puppeteer.launch({
      headless: true, // Run in headless mode
      args: [
        "--no-sandbox", // Disable the sandbox
        "--disable-setuid-sandbox", // Disable the setuid sandbox
      ],
    });

    const page = await browser.newPage();

    // Navigate to the URL.
    await page.goto("https://developer.chrome.com/");

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into the search box.
    await page
      .locator(".devsite-search-field")
      .fill("automate beyond recorder");

    // Wait and click on the first result.
    await page.locator(".devsite-result-item-link").click();

    // Locate the full title with a unique string.
    const textSelector = await page
      .locator("text/Customize and automate")
      .waitHandle();
    const fullTitle = await textSelector?.evaluate((el) => el.textContent);

    console.log('The title of this blog post is "%s".', fullTitle);

    return fullTitle; // Return the full title.
  } catch (error) {
    console.error("Error in scrapdata:", error.message);
    throw new Error(`Scraping failed: ${error.message}`);
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = { scrapdata };
