export function Dashboard({ productsCount }) {
  return (
    <div className="dashboard-grid">
      <article className="metric-card">
        <span className="metric-card__label">Produtos cadastrados</span>
        <strong className="metric-card__value">{productsCount}</strong>
        <p>Total calculado a partir dos produtos salvos no localStorage.</p>
      </article>
    </div>
  );
}
