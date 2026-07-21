import React from "react";

// Reserves the visual space a real photo will occupy later, so
// adding actual images (upload or URL) won't require any layout
// rework — just swap this out for an <img>. `size` controls aspect
// ratio: "card" for grid cards, "hero" for the details page header.
function PhotoPlaceholder({ size = "card" }) {
  return (
    <div className={`photo-placeholder photo-placeholder-${size}`}>
      <span className="photo-placeholder-icon">📷</span>
      <span className="photo-placeholder-text">Photo coming soon</span>
    </div>
  );
}

export default PhotoPlaceholder;
