import { useEffect, useRef, useState } from 'react';

export function ProductActions({ product, onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleEdit() {
    setIsOpen(false);
    onEdit(product);
  }

  function handleDelete() {
    setIsOpen(false);
    onDelete(product.id);
  }

  return (
    <div className="actions-menu" ref={menuRef}>
      <button
        type="button"
        className="actions-menu__trigger"
        aria-label={`Abrir ações para ${product.title}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentState) => !currentState)}
      >
        ⋮
      </button>

      {isOpen && (
        <div className="actions-menu__dropdown" role="menu">
          <button type="button" role="menuitem" onClick={handleEdit}>
            Editar
          </button>
          <button type="button" role="menuitem" className="actions-menu__danger" onClick={handleDelete}>
            Excluir
          </button>
        </div>
      )}
    </div>
  );
}
