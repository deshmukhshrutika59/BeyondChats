const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeOldestBlogs() {
  const url = "https://beyondchats.com/blogs/";

  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articleLinks = [];

  // Collect ALL article links
  $("a").each((i, el) => {
    const href = $(el).attr("href");
    if (href && href.includes("/blogs/") && !articleLinks.includes(href)) {
      articleLinks.push(href);
    }
  });

  if (articleLinks.length < 5) {
    throw new Error("Not enough articles found");
  }

  // Take LAST 5 = oldest
  const oldestLinks = articleLinks.slice(-5);

  const articles = [];

  for (const link of oldestLinks) {
    const fullUrl = link.startsWith("http")
      ? link
      : `https://beyondchats.com${link}`;

    const { data: articleData } = await axios.get(fullUrl);
    const $$ = cheerio.load(articleData);

    const title = $$("h1").first().text().trim();

    // Main content selector (robust)
    const content = $$("article")
      .text()
      .replace(/\s+/g, " ")
      .trim();

    if (!title || !content) continue;

    articles.push({
      title,
      originalContent: content,
      sourceUrl: fullUrl,
    });
  }

  return articles;
}

module.exports = scrapeOldestBlogs;
