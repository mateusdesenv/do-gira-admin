import { useMemo, useState } from 'react';
import { CustomerModal } from '../features/customers/CustomerModal.jsx';
import { CustomerTable } from '../features/customers/CustomerTable.jsx';

export function Customers({ customers, setCustomers }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();

    if (!normalizedTerm) {
      return customers;
    }

    return customers.filter((customer) => {
      return [customer.name, customer.cpf, customer.address]
        .join(' ')
        .toLowerCase()
        .includes(normalizedTerm);
    });
  }, [customers, searchTerm]);

  function handleAddCustomer() {
    setSelectedCustomer(null);
    setIsModalOpen(true);
  }

  function handleEditCustomer(customer) {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  }

  function handleDeleteCustomer(customerId) {
    const shouldDelete = window.confirm('Deseja excluir este cliente?');

    if (!shouldDelete) {
      return;
    }

    setCustomers((currentCustomers) => currentCustomers.filter((customer) => customer.id !== customerId));
  }

  function handleSaveCustomer(customerData) {
    if (selectedCustomer) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === selectedCustomer.id
            ? { ...customer, ...customerData, updatedAt: new Date().toISOString() }
            : customer
        )
      );
    } else {
      const newCustomer = {
        id: crypto.randomUUID(),
        ...customerData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCustomers((currentCustomers) => [newCustomer, ...currentCustomers]);
    }

    setIsModalOpen(false);
    setSelectedCustomer(null);
  }

  return (
    <div className="products-page customers-page">
      <div className="products-toolbar">
        <div className="products-toolbar__search">
          <label htmlFor="customer-search">Buscar cliente</label>
          <input
            id="customer-search"
            type="search"
            placeholder="Nome, CPF ou endereço"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum cliente encontrado</strong>
          <p>Cadastre o primeiro cliente informando nome, CPF e endereço.</p>
        </div>
      ) : (
        <CustomerTable
          customers={filteredCustomers}
          onEdit={handleEditCustomer}
          onDelete={handleDeleteCustomer}
        />
      )}

      <button type="button" className="floating-button" onClick={handleAddCustomer}>
        + Adicionar cliente
      </button>

      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCustomer(null);
          }}
          onSave={handleSaveCustomer}
        />
      )}
    </div>
  );
}
