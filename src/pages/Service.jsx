import { useMemo, useState } from 'react';
import { SaleModal } from '../features/sales/SaleModal.jsx';
import { SalesTable } from '../features/sales/SalesTable.jsx';
import { SalesGrid } from '../features/sales/SalesGrid.jsx';

function sortSalesByDate(sales) {
  return [...sales].sort((firstSale, secondSale) => new Date(secondSale.createdAt) - new Date(firstSale.createdAt));
}

export function Service({ sales, setSales, products, customers }) {
  const [viewMode, setViewMode] = useState('table');
  const [activeTab, setActiveTab] = useState('open');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openSales = useMemo(() => {
    return sortSalesByDate(sales.filter((sale) => sale.status !== 'finalizada'));
  }, [sales]);

  const finalizedSales = useMemo(() => {
    return sortSalesByDate(sales.filter((sale) => sale.status === 'finalizada'));
  }, [sales]);

  const visibleSales = useMemo(() => {
    const salesByTab = activeTab === 'open' ? openSales : finalizedSales;
    return salesByTab.slice(0, 20);
  }, [activeTab, finalizedSales, openSales]);

  const isOpenTab = activeTab === 'open';

  function handleSaveSale(saleData) {
    const newSale = {
      id: crypto.randomUUID(),
      ...saleData,
      status: 'aberta',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSales((currentSales) => [newSale, ...currentSales]);
    setActiveTab('open');
    setIsModalOpen(false);
  }

  function handleFinalizeSale(saleId) {
    setSales((currentSales) =>
      currentSales.map((sale) => {
        if (sale.id !== saleId) {
          return sale;
        }

        return {
          ...sale,
          status: 'finalizada',
          paidAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
      })
    );
  }

  return (
    <div className="products-page service-page">
      <div className="service-tabs" role="tablist" aria-label="Status das vendas">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'open'}
          className={activeTab === 'open' ? 'service-tabs__button service-tabs__button--active' : 'service-tabs__button'}
          onClick={() => setActiveTab('open')}
        >
          Vendas em aberto
          <span>{openSales.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'finalized'}
          className={activeTab === 'finalized' ? 'service-tabs__button service-tabs__button--active' : 'service-tabs__button'}
          onClick={() => setActiveTab('finalized')}
        >
          Vendas finalizadas
          <span>{finalizedSales.length}</span>
        </button>
      </div>

      <div className="products-toolbar">
        <div className="products-toolbar__search">
          <label>{isOpenTab ? 'Vendas em aberto' : 'Vendas finalizadas'}</label>
          <p className="toolbar-description">
            {isOpenTab
              ? 'Lista das vendas criadas e ainda não finalizadas.'
              : 'Histórico das vendas com pagamento confirmado.'}
          </p>
        </div>

        <div className="view-toggle" aria-label="Alternar visualização das vendas">
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

      {visibleSales.length === 0 ? (
        <div className="empty-state">
          <strong>{isOpenTab ? 'Nenhuma venda em aberto' : 'Nenhuma venda finalizada'}</strong>
          <p>
            {isOpenTab
              ? 'Use o botão “Nova venda” para registrar o primeiro atendimento.'
              : 'As vendas finalizadas aparecerão aqui depois da confirmação de pagamento.'}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <SalesTable sales={visibleSales} onFinalizeSale={isOpenTab ? handleFinalizeSale : undefined} />
      ) : (
        <SalesGrid sales={visibleSales} onFinalizeSale={isOpenTab ? handleFinalizeSale : undefined} />
      )}

      <button type="button" className="floating-button" onClick={() => setIsModalOpen(true)}>
        + Nova venda
      </button>

      {isModalOpen && (
        <SaleModal
          customers={customers}
          products={products}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveSale}
        />
      )}
    </div>
  );
}
