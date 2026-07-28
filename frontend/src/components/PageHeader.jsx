function PageHeader({ title, subtitle, icon, children }) {
  return (
    <section className="page-header">
      <div className="page-header-main">
        <div className="page-header-icon">{icon}</div>

        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>

      {children && <div className="page-header-extra">{children}</div>}
    </section>
  );
}

export default PageHeader;