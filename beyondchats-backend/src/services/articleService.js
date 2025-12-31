const Article = require("../models/Article");

async function saveArticles(articles) {
  for (const article of articles) {
    const exists = await Article.findOne({ title: article.title });
    if (!exists) {
      await Article.create(article);
    }
  }
}

module.exports = { saveArticles };
