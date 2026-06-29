import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/currency.js';

function getProductSalePrice(product) {
  const promotionalPrice = product.promotionalPrice === '' ? null : Number(product.promotionalPrice);

  if (promotionalPrice !== null && !Number.isNaN(promotionalPrice) && promotionalPrice > 0) {
    return promotionalPrice;
  }

  return Number(product.price || 0);
}

export function SaleModal({ customers, products, onClose, onSave }) {
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id ?? '');
  const [selectedProducts, setSelectedProducts] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState('');

  const filteredProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return products;
    }

    return products.filter((product) => {
      return [product.title, product.description, product.category]
        .join(' ')
        .toLowerCase()
        .includes(normalizedTerm);
    });
  }, [products, searchTerm]);

  const selectedItems = useMemo(() => {
    return Object.entries(selectedProducts)
      .map(([productId, itemData]) => {
        const product = products.find((currentProduct) => currentProduct.id === productId);

        if (!product) {
          return null;
        }

        const unitPrice = getProductSalePrice(product);
        const quantity = Number(itemData.quantity || 1);

        return {
          productId: product.id,
          title: product.title,
          category: product.category,
          image: product.image,
          unitPrice,
          quantity,
          total: unitPrice * quantity
        };
      })
      .filter(Boolean);
  }, [products, selectedProducts]);

  const saleTotal = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.total, 0);
  }, [selectedItems]);

  const selectedQuantity = useMemo(() => {
    return selectedItems.reduce((total, item) => total + item.quantity, 0);
  }, [selectedItems]);

  function toggleProduct(productId) {
    setSelectedProducts((currentProducts) => {
      if (currentProducts[productId]) {
        const updatedProducts = { ...currentProducts };
        delete updatedProducts[productId];
        return updatedProducts;
      }

      return {
        ...currentProducts,
        [productId]: { quantity: 1 }
      };
    });
  }

  function updateQuantity(productId, quantity) {
    const normalizedQuantity = Math.max(1, Number(quantity || 1));

    setSelectedProducts((currentProducts) => ({
      ...currentProducts,
      [productId]: { quantity: normalizedQuantity }
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFormError('');

    const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId);

    if (!selectedCustomer) {
      setFormError('Selecione um cliente para registrar a venda.');
      return;
    }

    if (selectedItems.length === 0) {
      setFormError('Selecione pelo menos um produto para registrar a venda.');
      return;
    }

    onSave({
      customerId: selectedCustomer.id,
      customer: {
        id: selectedCustomer.id,
        name: selectedCustomer.name,
        cpf: selectedCustomer.cpf,
        address: selectedCustomer.address
      },
      items: selectedItems,
      total: saleTotal,
      status: 'aberta'
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal sale-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sale-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Atendimento</span>
            <h2 id="sale-modal-title">Nova venda</h2>
          </div>
          <button type="button" className="modal__close" aria-label="Fechar modal" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="sale-form" onSubmit={handleSubmit}>
          <div className="sale-form__topbar">
            <label>
              Cliente
              <select
                value={selectedCustomerId}
                onChange={(event) => setSelectedCustomerId(event.target.value)}
                required
              >
                {customers.length === 0 ? (
                  <option value="">Nenhum cliente cadastrado</option>
                ) : (
                  customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name} · {customer.cpf}
                    </option>
                  ))
                )}
              </select>
            </label>

            <label>
              Buscar produto
              <input
                type="search"
                placeholder="Nome, descrição ou categoria"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </label>
          </div>

          {products.length === 0 ? (
            <div className="empty-state sale-modal__empty">
              <strong>Nenhum produto cadastrado</strong>
              <p>Cadastre produtos antes de registrar uma venda.</p>
            </div>
          ) : (
            <div className="sale-products-wrap">
              <table className="products-table sale-products-table">
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Produto</th>
                    <th>Categoria</th>
                    <th>Preço</th>
                    <th>Qtd.</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => {
                    const isSelected = Boolean(selectedProducts[product.id]);
                    const quantity = selectedProducts[product.id]?.quantity ?? 1;
                    const unitPrice = getProductSalePrice(product);

                    return (
                      <tr key={product.id} className={isSelected ? 'sale-products-table__row--selected' : ''}>
                        <td>
                          <input
                            className="sale-product-check"
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleProduct(product.id)}
                            aria-label={`Selecionar ${product.title}`}
                          />
                        </td>
                        <td>
                          <div className="product-cell sale-product-cell">
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
                        <td>{formatCurrency(unitPrice)}</td>
                        <td>
                          <input
                            className="sale-quantity-input"
                            type="number"
                            min="1"
                            step="1"
                            value={quantity}
                            disabled={!isSelected}
                            onChange={(event) => updateQuantity(product.id, event.target.value)}
                          />
                        </td>
                        <td>
                          <strong>{isSelected ? formatCurrency(unitPrice * quantity) : '—'}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {formError && <p className="form-error">{formError}</p>}

          <footer className="sale-total-bar">
            <div>
              <span>Itens selecionados</span>
              <strong>{selectedQuantity}</strong>
            </div>
            <div>
              <span>Total da venda</span>
              <strong>{formatCurrency(saleTotal)}</strong>
            </div>
          </footer>

          <footer className="modal__footer sale-modal__footer">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button--primary" disabled={customers.length === 0 || products.length === 0}>
              Salvar venda
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
