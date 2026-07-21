import React from "react";

function SkeletonCards({ count = 3 }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="card skeleton-card" key={i}>
          <div className="skeleton-line skeleton-title" />
          <div className="skeleton-line skeleton-text" />
          <div className="skeleton-line skeleton-text" style={{ width: "60%" }} />
          <div className="skeleton-line skeleton-button" />
        </div>
      ))}
    </div>
  );
}

export default SkeletonCards;
