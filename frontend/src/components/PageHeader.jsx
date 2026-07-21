import React from "react";

// Smaller companion to the Home page's full hero — same gradient
// and brand language, scaled down to sit above a page's actual
// content (filters, forms, cards) instead of replacing it.
function PageHeader({ title, subtitle, icon }) {
  return (
    <header className="page-header">
      {icon && <span className="page-header-icon">{icon}</span>}
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </header>
  );
}

export default PageHeader;
