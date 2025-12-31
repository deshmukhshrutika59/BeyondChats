// require("dotenv").config();
// const axios = require("axios");
// const cheerio = require("cheerio");

// // Fetch articles
// async function fetchArticles() {
//   const res = await axios.get("http://localhost:5000/api/articles");
//   return res.data;
// }

// // Google search
// async function googleSearch(query) {
//   const res = await axios.get("https://serpapi.com/search.json", {
//     params: {
//       q: query,
//       api_key: process.env.SERP_API_KEY,
//       num: 5
//     }
//   });
//   return res.data.organic_results || [];
// }

// // Filter links
// function filterValidArticles(results) {
//   return results
//     .filter(r => r.link && !r.link.includes("beyondchats.com"))
//     .slice(0, 2);
// }

// // Scrape content
// async function scrapeContent(url) {
//   const { data } = await axios.get(url, { timeout: 15000 });
//   const $ = cheerio.load(data);
//   return ($("article").text() || $("body").text())
//     .replace(/\s+/g, " ")
//     .trim();
// }

// async function rewriteArticle(original, ref1, ref2) {
//   const prompt = `
// You are a professional SEO blog editor.

// Original Article:
// ${original}

// Reference Article 1:
// ${ref1}

// Reference Article 2:
// ${ref2}

// Rewrite the original article so that:
// - Structure and formatting resemble top-ranking articles
// - Content is original and plagiarism-free
// - Tone is professional
// - Return ONLY clean HTML
// `;

//   const res = await axios.post(
//     "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
//     {
//       contents: [
//         {
//           parts: [{ text: prompt }]
//         }
//       ]
//     },
//     {
//       params: {
//         key: process.env.GEMINI_API_KEY
//       }
//     }
//   );

//   return res.data.candidates[0].content.parts[0].text;
// }

// // Update article
// async function updateArticle(id, updatedContent, references) {
//   await axios.put(`http://localhost:5000/api/articles/${id}`, {
//     updatedContent,
//     isUpdated: true,
//     references
//   });
// }

// // Main runner
// async function run() {
//   console.log("Starting Phase 2...");

//   const articles = await fetchArticles();

//   for (const article of articles) {
//     if (article.isUpdated) continue;

//     console.log("Processing:", article.title);

//     const results = await googleSearch(article.title);
//     const refs = filterValidArticles(results);
//     if (refs.length < 2) continue;

//     const c1 = await scrapeContent(refs[0].link);
//     const c2 = await scrapeContent(refs[1].link);

//     const updated = await rewriteArticle(
//       article.originalContent,
//       c1,
//       c2
//     );

//     await updateArticle(article._id, `
// ${updated}
// <hr/>
// <h3>References</h3>
// <ul>
//   <li>${refs[0].link}</li>
//   <li>${refs[1].link}</li>
// </ul>
// `, refs.map(r => r.link));

//     console.log("Updated:", article.title);
//   }

//   console.log("Phase 2 completed successfully.");
// }

// run().catch(err => console.error(err.message));


/**
 * Phase 2 – Article Update Automation Script (OpenAI Version)
 * -----------------------------------------------------------
 * - Fetches articles from backend API
 * - Searches article titles on Google (SerpAPI)
 * - Scrapes top 2 ranking articles (non-BeyondChats)
 * - Uses OpenAI to rewrite content
 * - Updates articles using CRUD API
 */

require("dotenv").config();

const axios = require("axios");
const cheerio = require("cheerio");
const OpenAI = require("openai");

// ---------------- OPENAI SETUP ----------------
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY missing in .env");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------------- FETCH ARTICLES ----------------
async function fetchArticles() {
  const res = await axios.get("http://localhost:5000/api/articles");
  return res.data;
}

// ---------------- GOOGLE SEARCH ----------------
async function googleSearch(query) {
  if (!process.env.SERP_API_KEY) {
    throw new Error("SERP_API_KEY missing in .env");
  }

  const res = await axios.get("https://serpapi.com/search.json", {
    params: {
      q: query,
      api_key: process.env.SERP_API_KEY,
      num: 5
    }
  });

  return res.data.organic_results || [];
}

// ---------------- FILTER VALID LINKS ----------------
function filterValidArticles(results) {
  return results
    .filter(
      r =>
        r.link &&
        r.link.startsWith("http") &&
        !r.link.includes("beyondchats.com")
    )
    .slice(0, 2);
}

// ---------------- SCRAPE CONTENT ----------------
async function scrapeContent(url) {
  const { data } = await axios.get(url, { timeout: 15000 });
  const $ = cheerio.load(data);

  const content =
    $("article").text() ||
    $("main").text() ||
    $("body").text();

  return content.replace(/\s+/g, " ").trim();
}

// ---------------- OPENAI REWRITE ----------------
async function rewriteArticle(original, ref1, ref2) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a professional SEO blog editor."
      },
      {
        role: "user",
        content: `
Original Article:
${original}

Reference Article 1:
${ref1}

Reference Article 2:
${ref2}

Rewrite the original article so that:
- Structure and formatting resemble the reference articles
- Content is original and plagiarism-free
- Tone is professional and informative
- Use SEO-friendly headings
- Return ONLY clean HTML (no markdown, no explanation)
        `
      }
    ],
    temperature: 0.4
  });

  return response.choices[0].message.content;
}

// ---------------- UPDATE ARTICLE ----------------
async function updateArticle(id, updatedContent, references) {
  await axios.put(`http://localhost:5000/api/articles/${id}`, {
    updatedContent,
    isUpdated: true,
    references
  });
}

// ---------------- MAIN RUNNER ----------------
async function run() {
  console.log("Starting Phase 2 article update process...\n");

  const articles = await fetchArticles();

  for (const article of articles) {
    if (article.isUpdated) {
      console.log(`Skipping (already updated): ${article.title}`);
      continue;
    }

    console.log(`Processing: ${article.title}`);

    const searchResults = await googleSearch(article.title);
    const refs = filterValidArticles(searchResults);

    if (refs.length < 2) {
      console.log("Not enough valid reference articles found. Skipping.\n");
      continue;
    }

    const refContent1 = await scrapeContent(refs[0].link);
    const refContent2 = await scrapeContent(refs[1].link);

    const rewrittenContent = await rewriteArticle(
      article.originalContent,
      refContent1,
      refContent2
    );

    const finalContent = `
${rewrittenContent}
<hr />
<h3>References</h3>
<ul>
  <li>${refs[0].link}</li>
  <li>${refs[1].link}</li>
</ul>
`;

    await updateArticle(article._id, finalContent, [
      refs[0].link,
      refs[1].link
    ]);

    console.log(`Updated: ${article.title}\n`);
  }

  console.log("Phase 2 completed successfully.");
}

// ---------------- EXECUTE ----------------
run().catch(err => {
  console.error("Phase 2 failed:");
  console.error(err);
});
