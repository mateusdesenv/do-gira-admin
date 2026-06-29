import { useMemo, useState } from 'react';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { Login } from './pages/Login.jsx';
import { Service } from './pages/Service.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Products } from './pages/Products.jsx';
import { Customers } from './pages/Customers.jsx';
import { PlaceholderPage } from './pages/PlaceholderPage.jsx';
import { useLocalStorage } from './utils/useLocalStorage.js';

const PRODUCTS_STORAGE_KEY = 'do-gira:products';
const CUSTOMERS_STORAGE_KEY = 'do-gira:customers';
const SALES_STORAGE_KEY = 'do-gira:sales';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('do-gira:isLoggedIn', false);
  const [activePage, setActivePage] = useState('service');
  const [products, setProducts] = useLocalStorage(PRODUCTS_STORAGE_KEY, []);
  const [customers, setCustomers] = useLocalStorage(CUSTOMERS_STORAGE_KEY, []);
  const [sales, setSales] = useLocalStorage(SALES_STORAGE_KEY, []);

  const pageTitle = useMemo(() => {
    const titles = {
      service: 'Atendimento',
      dashboard: 'Dashboard',
      products: 'Produtos',
      customers: 'Clientes',
      snacks: 'Lanches',
      settings: 'Configurações'
    };

    return titles[activePage] ?? 'Atendimento';
  }, [activePage]);

  function handleLogout() {
    setIsLoggedIn(false);
    setActivePage('service');
  }

  function renderPage() {
    switch (activePage) {
      case 'service':
        return (
          <Service
            sales={sales}
            setSales={setSales}
            products={products}
            customers={customers}
          />
        );
      case 'dashboard':
        return <Dashboard productsCount={products.length} />;
      case 'products':
        return <Products products={products} setProducts={setProducts} />;
      case 'customers':
        return <Customers customers={customers} setCustomers={setCustomers} />;
      case 'snacks':
        return (
          <PlaceholderPage
            title="Lanches"
            description="Tela reservada para o futuro CRUD de lanches, combos e adicionais."
          />
        );
      case 'settings':
        return (
          <PlaceholderPage
            title="Configurações"
            description="Tela reservada para dados do negócio, WhatsApp, horários e preferências do sistema."
          />
        );
      default:
        return (
          <Service
            sales={sales}
            setSales={setSales}
            products={products}
            customers={customers}
          />
        );
    }
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <AdminLayout
      activePage={activePage}
      onChangePage={setActivePage}
      pageTitle={pageTitle}
      onLogout={handleLogout}
    >
      {renderPage()}
    </AdminLayout>
  );
}
