import { useEffect, useMemo, useState } from 'react';

const initialFormState = {
  name: '',
  cpf: '',
  address: ''
};

function onlyDigits(value) {
  return value.replace(/\D/g, '');
}

function formatCpf(value) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) {
    return digits;
  }

  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  }

  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

export function CustomerModal({ customer, onClose, onSave }) {
  const [formData, setFormData] = useState(initialFormState);

  const modalTitle = useMemo(() => (customer ? 'Editar cliente' : 'Adicionar cliente'), [customer]);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name ?? '',
        cpf: customer.cpf ?? '',
        address: customer.address ?? ''
      });
    }
  }, [customer]);

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSave({
      name: formData.name.trim(),
      cpf: formatCpf(formData.cpf),
      address: formData.address.trim()
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal modal--compact"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Clientes</span>
            <h2 id="customer-modal-title">{modalTitle}</h2>
          </div>
          <button type="button" className="modal__close" aria-label="Fechar modal" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>
              Nome
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Nome completo do cliente"
                required
              />
            </label>

            <label>
              CPF
              <input
                type="text"
                inputMode="numeric"
                value={formData.cpf}
                onChange={(event) => updateField('cpf', formatCpf(event.target.value))}
                placeholder="000.000.000-00"
                maxLength="14"
                required
              />
            </label>
          </div>

          <label>
            Endereço
            <textarea
              rows="4"
              value={formData.address}
              onChange={(event) => updateField('address', event.target.value)}
              placeholder="Rua, número, bairro, cidade e complemento"
              required
            />
          </label>

          <footer className="modal__footer">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button--primary">
              Salvar cliente
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
