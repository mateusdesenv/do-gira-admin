import { CustomerActions } from './CustomerActions.jsx';

export function CustomerTable({ customers, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <table className="products-table customers-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>CPF</th>
            <th>Endereço</th>
            <th className="products-table__actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>
                <div className="customer-cell">
                  <span className="customer-cell__avatar" aria-hidden="true">
                    {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                  </span>
                  <strong>{customer.name}</strong>
                </div>
              </td>
              <td>{customer.cpf || '—'}</td>
              <td className="customer-address">{customer.address}</td>
              <td className="products-table__actions">
                <CustomerActions customer={customer} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
