import { ProductActions } from './ProductActions.jsx';
import { formatCurrency } from '../../utils/currency.js';

export function ProductGrid({ products, onEdit, onDelete }) {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <div className="product-card__image">
            {product.image ? <img src={product.image} alt={product.title} /> : <span>DG</span>}
            <div className="product-card__actions">
              <ProductActions product={product} onEdit={onEdit} onDelete={onDelete} />
            </div>
          </div>

          <div className="product-card__body">
            <span className="pill">{product.category}</span>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
          </div>

          <footer className="product-card__footer">
            <div>
              <span>Valor</span>
              <strong>{formatCurrency(product.price)}</strong>
            </div>
            <div>
              <span>Promoção</span>
              <strong>{product.promotionalPrice !== '' ? formatCurrency(product.promotionalPrice) : '—'}</strong>
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}
