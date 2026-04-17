const express = require("express");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

const app = express();

async function scrape(url, sellSelector, buySelector) {
    const html = await fetch(url).then(r => r.text());
    const $ = cheerio.load(html);
    return {
        sell: parseFloat($(sellSelector).text()),
        buy: parseFloat($(buySelector).text())
    };
}

app.get("/prices", async (req, res) => {
    try {
        const gc = await scrape("https://golden-circle.net", "#sell24", "#buy24");
        const ed = await scrape("https://edahabapp.com", "#sell24", "#buy24");
        res.json({ gc, ed });
    } catch (err) {
        res.json({ error: err.message });
    }
});

app.listen(3000, () => console.log("API running"));
