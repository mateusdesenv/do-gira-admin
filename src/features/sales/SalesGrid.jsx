import { formatCurrency } from '../../utils/currency.js';

function formatSaleDate(dateValue) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateValue));
}

function getSaleStatusLabel(status) {
  return status === 'finalizada' ? 'Finalizada' : 'Aberta';
}

function getSaleStatusClass(status) {
  return status === 'finalizada' ? 'pill pill--done' : 'pill pill--open';
}

export function SalesGrid({ sales, onFinalizeSale }) {
  return (
    <div className="sales-grid">
      {sales.map((sale) => {
        const isFinalized = sale.status === 'finalizada';

        return (
          <article className="sale-card" key={sale.id}>
            <header className="sale-card__header">
              <div>
                <span>{formatSaleDate(sale.createdAt)}</span>
                <h3>{sale.customer?.name || 'Cliente removido'}</h3>
              </div>
              <strong>{formatCurrency(sale.total)}</strong>
            </header>

            <div className="sale-card__status">
              <span className={getSaleStatusClass(sale.status)}>{getSaleStatusLabel(sale.status)}</span>
            </div>

            <div className="sale-card__items">
              {sale.items.slice(0, 4).map((item) => (
                <span key={item.productId}>
                  {item.quantity}x {item.title}
                </span>
              ))}
              {sale.items.length > 4 && <span>+{sale.items.length - 4} produto(s)</span>}
            </div>

            {!isFinalized && onFinalizeSale && (
              <button type="button" className="sales-action-button sales-action-button--block" onClick={() => onFinalizeSale(sale.id)}>
                Finalizar venda
              </button>
            )}
          </article>
        );
      })}
    </div>
  );
}
