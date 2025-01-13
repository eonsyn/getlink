const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors"); // Import the CORS middleware
require("dotenv").config();
const { chromium } = require("playwright");

// Initialize Express app
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Function to fetch MKV link
const fetchMkvLink = async (finalLink) => {
  try {
    console.log("Working...");
    // Launch browser and set up context with user agent
    const browser = await chromium.launch(); // Launch browser

    const context = await browser.newContext({
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
    }); // Set user-agent while creating a new context

    const page = await context.newPage(); // Create a new page in the context

    // Navigate to the finalLink to extract the URL
    await page.goto(finalLink, { waitUntil: "domcontentloaded" });

    // Wait for a selector or ensure the page is fully loaded
    await page.waitForSelector("body");

    // Extract the URL from the script tag using page.evaluate
    const extractedUrl = await page.evaluate(() => {
      // This will search for the script tag with the 'url' assignment and extract the URL
      const scriptTag = [...document.getElementsByTagName("script")].find(
        (script) => script.innerHTML.includes("var url")
      );
      if (scriptTag) {
        const regex = /var url = '(https?[^']+)'/;
        const match = regex.exec(scriptTag.innerHTML);
        return match ? match[1] : null; // Return the extracted URL
      }
      return null; // Return null if URL is not found
    });

    console.log("Extracted URL:", extractedUrl);

    if (extractedUrl) {
      // Now navigate to the extracted URL to find the .mkv link
      await page.goto(extractedUrl, { waitUntil: "domcontentloaded" });

      // Wait for a selector or ensure the page is fully loaded
      await page.waitForSelector("body");

      // Get the content of the page after the redirection
      const content = await page.content();

      const $ = cheerio.load(content);
      const mkvLink = $('a[href$=".mkv"]').attr("href");

      if (mkvLink) {
        console.log("Found .mkv link:", mkvLink);
        await browser.close();
        return mkvLink; // Return the .mkv link
      } else {
        console.log("No .mkv link found.");
        await browser.close();
        return null;
      }
    } else {
      console.log("Extracted URL is null.");
      await browser.close();
      return null;
    }
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
};

app.get("/test", async (req, res) => {
  try {
    const { finalLink } = req.query;
    const data = await fetchMkvLink(finalLink);
    res.json({ finalLink: data }); // Corrected res.send.json to res.json
  } catch (err) {
    console.error(err);
    res.status(500).send("Error processing the request.");
  }
});

app.get("/", (req, res) => {
  res.send("server is live");
});
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
