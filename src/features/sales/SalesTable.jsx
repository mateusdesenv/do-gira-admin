import { formatCurrency } from '../../utils/currency.js';

function formatSaleDate(dateValue) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateValue));
}

function formatItemsSummary(items) {
  const totalQuantity = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const firstItems = items.slice(0, 2).map((item) => `${item.quantity}x ${item.title}`).join(', ');
  const extraItems = items.length > 2 ? ` +${items.length - 2}` : '';

  return `${totalQuantity} item${totalQuantity === 1 ? '' : 's'} · ${firstItems}${extraItems}`;
}

function getSaleStatusLabel(status) {
  return status === 'finalizada' ? 'Finalizada' : 'Aberta';
}

function getSaleStatusClass(status) {
  return status === 'finalizada' ? 'pill pill--done' : 'pill pill--open';
}

export function SalesTable({ sales, onFinalizeSale }) {
  return (
    <div className="table-card">
      <table className="products-table sales-table">
        <thead>
          <tr>
            <th>Data</th>
            <th>Cliente</th>
            <th>Produtos</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => {
            const isFinalized = sale.status === 'finalizada';

            return (
              <tr key={sale.id}>
                <td>{formatSaleDate(sale.createdAt)}</td>
                <td>
                  <div className="customer-cell">
                    <span className="customer-cell__avatar" aria-hidden="true">
                      {sale.customer?.name?.charAt(0)?.toUpperCase() || 'C'}
                    </span>
                    <div>
                      <strong>{sale.customer?.name || 'Cliente removido'}</strong>
                      <p className="sale-customer-doc">{sale.customer?.cpf || 'CPF não informado'}</p>
                    </div>
                  </div>
                </td>
                <td className="sale-items-summary">{formatItemsSummary(sale.items)}</td>
                <td>
                  <strong>{formatCurrency(sale.total)}</strong>
                </td>
                <td>
                  <span className={getSaleStatusClass(sale.status)}>{getSaleStatusLabel(sale.status)}</span>
                </td>
                <td>
                  {!isFinalized && onFinalizeSale ? (
                    <button type="button" className="sales-action-button" onClick={() => onFinalizeSale(sale.id)}>
                      Finalizar
                    </button>
                  ) : (
                    <span className="sales-action-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
