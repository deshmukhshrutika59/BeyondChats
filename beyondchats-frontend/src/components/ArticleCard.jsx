import { useState } from "react";

export default function ArticleCard({ article }) {
  const [showUpdated, setShowUpdated] = useState(false);

  return (
    <div className="card">
      <h2>{article.title}</h2>

      <button onClick={() => setShowUpdated(!showUpdated)}>
        {showUpdated ? "Show Original" : "Show Updated"}
      </button>

      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: showUpdated && article.updatedContent
            ? article.updatedContent
            : article.originalContent
        }}
      />

      {article.references?.length > 0 && (
        <div className="refs">
          <h4>References</h4>
          <ul>
            {article.references.map((ref, i) => (
              <li key={i}>
                <a href={ref} target="_blank">{ref}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
