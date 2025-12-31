const express = require("express");
const router = express.Router();
const scrapeOldestBlogs = require("../scrapers/blogScraper");
const { saveArticles } = require("../services/articleService");

router.post("/scrape", async (req, res) => {
  const articles = await scrapeOldestBlogs();
  await saveArticles(articles);
  res.json({ message: "Scraping completed", count: articles.length });
});

module.exports = router;
