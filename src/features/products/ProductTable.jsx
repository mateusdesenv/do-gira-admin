import { ProductActions } from './ProductActions.jsx';
import { formatCurrency } from '../../utils/currency.js';

export function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="table-card">
      <table className="products-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Categoria</th>
            <th>Valor</th>
            <th>Promocional</th>
            <th className="products-table__actions">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>
                <div className="product-cell">
                  <div className="product-cell__image">
                    {product.image ? <img src={product.image} alt={product.title} /> : <span>DG</span>}
                  </div>
                  <div>
                    <strong>{product.title}</strong>
                    <p>{product.description}</p>
                  </div>
                </div>
              </td>
              <td>
                <span className="pill">{product.category}</span>
              </td>
              <td>{formatCurrency(product.price)}</td>
              <td>{product.promotionalPrice !== '' ? formatCurrency(product.promotionalPrice) : '—'}</td>
              <td className="products-table__actions">
                <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
