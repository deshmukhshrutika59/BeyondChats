import { useEffect, useState } from "react";
import axios from "axios";
import ArticleCard from "../components/ArticleCard";

const API = import.meta.env.VITE_API_URL;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/articles`)
      .then(res => setArticles(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading articles...</p>;

  return (
    <div className="container">
      <h1>BeyondChats Articles</h1>
      {articles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}
