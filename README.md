# BeyondChats – Full Stack Web Developer Intern Assignment

## 📌 Project Overview

This project was developed as part of the **BeyondChats Full Stack Web Developer Intern assignment**.
The goal of the assignment is to build an **end-to-end content automation system** that:

1. Scrapes blog articles from BeyondChats
2. Stores them in a database with CRUD APIs
3. Enhances articles using Google Search + LLM (AI)
4. Displays original and updated articles in a professional frontend UI

The project is divided into **three phases**, as required.

---

## 🧱 Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Axios
* Cheerio (web scraping)
* SerpAPI (Google Search)
* OpenAI API (LLM for content enhancement)

### Frontend

* React.js (Vite)
* Axios
* CSS (responsive & minimal UI)

### Tools

* Git & GitHub
* Postman (API testing)

---

## 📂 Project Structure

```
beyondchats-assignment/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   └── Article.js
│   │   ├── controllers/
│   │   │   └── articleController.js
│   │   ├── routes/
│   │   │   ├── articleRoutes.js
│   │   │   └── scrapeRoutes.js
│   │   ├── scrapers/
│   │   │   └── blogScraper.js
│   │   ├── scripts/
│   │   │   └── updateArticles.js
│   │   └── app.js
│   │
│   ├── .env.example
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ArticleCard.jsx
│   │   ├── pages/
│   │   │   └── Home.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Phase 1 – Scraping & CRUD APIs

### Features

* Scrapes **5 oldest blog articles** from BeyondChats
* Extracts:

  * Title
  * Full content
  * Source URL
* Stores articles in MongoDB
* Provides full **CRUD APIs**

### API Endpoints

| Method | Endpoint            | Description              |
| ------ | ------------------- | ------------------------ |
| GET    | `/api/articles`     | Get all articles         |
| GET    | `/api/articles/:id` | Get single article       |
| POST   | `/api/articles`     | Create article           |
| PUT    | `/api/articles/:id` | Update article           |
| DELETE | `/api/articles/:id` | Delete article           |
| POST   | `/api/scrape`       | Scrape BeyondChats blogs |

---

## 🤖 Phase 2 – Automation Script (Google + AI)

### Description

A Node.js automation script that:

1. Fetches articles using backend APIs
2. Searches article titles on Google using SerpAPI
3. Selects top 2 non-BeyondChats articles
4. Scrapes their main content
5. Uses an LLM (OpenAI) to rewrite the original article
6. Publishes the updated article via CRUD APIs
7. Appends reference links at the bottom

### Important Note on LLM Usage

Due to **API quota limitations**, the script demonstrates the **complete automation pipeline** on a limited number of articles.
The logic is fully scalable and supports updating all articles once sufficient API quota is available.

This limitation is external to the application and does not affect the correctness of the implementation.

---

## 🖥️ Phase 3 – React Frontend

### Features

* Fetches articles from backend APIs
* Displays:

  * Original article content
  * Updated (AI-generated) article content
* Toggle between original and updated versions
* Responsive and professional UI

---

## 🔁 Data Flow / Architecture

```
BeyondChats Blog
        ↓
Web Scraper (Cheerio)
        ↓
MongoDB Database
        ↓
CRUD APIs (Express)
        ↓
Automation Script
  ├─ Google Search (SerpAPI)
  ├─ Content Scraping
  ├─ LLM (OpenAI)
        ↓
Updated Articles Stored
        ↓
React Frontend UI
```

---

## ⚙️ Local Setup Instructions

### 1️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/beyondchats
SERP_API_KEY=your_serpapi_key
OPENAI_API_KEY=your_openai_api_key
```

Run backend:

```bash
npx nodemon src/app.js
```

---

### 2️⃣ Scrape Articles (Phase 1)

```http
POST http://localhost:5000/api/scrape
```

---

### 3️⃣ Run Automation Script (Phase 2)

> Backend must be running

```bash
node src/scripts/updateArticles.js
```

---

### 4️⃣ Frontend Setup (Phase 3)

```bash
cd frontend
npm install
```

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## 🧪 Testing

* APIs tested using Postman
* Frontend tested manually in browser
* Script logs confirm successful automation flow

---

## 📈 Evaluation Criteria Mapping

| Criteria      | Covered                    |
| ------------- | -------------------------- |
| Completeness  | ✅ All 3 phases implemented |
| ReadMe & Docs | ✅ Detailed README          |
| UI/UX         | ✅ Clean & responsive       |
| Live Link     | 🔲 Ready for deployment    |
| Code Quality  | ✅ Modular & readable       |

---

## 🧠 Key Learnings

* Real-world web scraping challenges
* API-driven automation pipelines
* LLM integration in backend workflows
* Handling third-party API limitations gracefully
* Full-stack data flow design

---

## 👤 Author

**Shrutika Deshmukh**

---

