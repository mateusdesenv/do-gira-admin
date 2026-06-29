import { useEffect, useState } from 'react';
import logo from '../assets/logo-do-gira.png';

const menuItems = [
  { id: 'service', label: 'Atendimento', icon: '◈' },
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'products', label: 'Produtos', icon: '▤' },
  { id: 'customers', label: 'Clientes', icon: '◉' },
  { id: 'snacks', label: 'Lanches', icon: '◧' },
  { id: 'settings', label: 'Configurações', icon: '⚙' }
];

export function AdminLayout({ activePage, onChangePage, pageTitle, onLogout, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activePage]);

  return (
    <div className="admin-shell">
      <aside className={`sidebar ${isSidebarOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <img src={logo} alt="Do Gira" className="sidebar__logo" />
          <div>
            <strong>Do Gira</strong>
            <span>Admin</span>
          </div>
        </div>

        <nav className="sidebar__nav" aria-label="Menu principal">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`sidebar__link ${activePage === item.id ? 'sidebar__link--active' : ''}`}
              onClick={() => onChangePage(item.id)}
            >
              <span className="sidebar__icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="sidebar__logout" onClick={onLogout}>
          Sair
        </button>
      </aside>

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="main-panel">
        <header className="topbar">
          <button
            type="button"
            className="topbar__menu"
            aria-label="Abrir menu"
            onClick={() => setIsSidebarOpen(true)}
          >
            ☰
          </button>
          <div>
            <span className="topbar__eyebrow">Painel administrativo</span>
            <h1>{pageTitle}</h1>
          </div>
        </header>

        <section className="content-area">{children}</section>
      </main>
    </div>
  );
}
