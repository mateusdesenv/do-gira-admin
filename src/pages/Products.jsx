import { useMemo, useState } from 'react';
import { ProductModal } from '../features/products/ProductModal.jsx';
import { ProductTable } from '../features/products/ProductTable.jsx';
import { ProductGrid } from '../features/products/ProductGrid.jsx';

export function Products({ products, setProducts }) {
  const [viewMode, setViewMode] = useState('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  function handleAddProduct() {
    setSelectedProduct(null);
    setIsModalOpen(true);
  }

  function handleEditProduct(product) {
    setSelectedProduct(product);
    setIsModalOpen(true);
  }

  function handleDeleteProduct(productId) {
    const shouldDelete = window.confirm('Deseja excluir este produto?');

    if (!shouldDelete) {
      return;
    }

    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));
  }

  function handleSaveProduct(productData) {
    if (selectedProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.id === selectedProduct.id
            ? { ...product, ...productData, updatedAt: new Date().toISOString() }
            : product
        )
      );
    } else {
      const newProduct = {
        id: crypto.randomUUID(),
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProducts((currentProducts) => [newProduct, ...currentProducts]);
    }

    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  return (
    <div className="products-page">
      <div className="products-toolbar">
        <div className="products-toolbar__search">
          <label htmlFor="product-search">Buscar produto</label>
          <input
            id="product-search"
            type="search"
            placeholder="Título, descrição ou categoria"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="view-toggle" aria-label="Alternar visualização">
          <button
            type="button"
            className={viewMode === 'table' ? 'view-toggle__button view-toggle__button--active' : 'view-toggle__button'}
            onClick={() => setViewMode('table')}
          >
            Lista
          </button>
          <button
            type="button"
            className={viewMode === 'grid' ? 'view-toggle__button view-toggle__button--active' : 'view-toggle__button'}
            onClick={() => setViewMode('grid')}
          >
            Grid
          </button>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum produto encontrado</strong>
          <p>Cadastre o primeiro produto para começar a montar o catálogo do mini-mercado.</p>
        </div>
      ) : viewMode === 'table' ? (
        <ProductTable
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      ) : (
        <ProductGrid
          products={filteredProducts}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      <button type="button" className="floating-button" onClick={handleAddProduct}>
        + Adicionar produto
      </button>

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
