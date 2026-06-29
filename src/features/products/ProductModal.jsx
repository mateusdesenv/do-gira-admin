import { useEffect, useMemo, useState } from 'react';
import { fileToBase64 } from '../../utils/fileToBase64.js';

const initialFormState = {
  image: '',
  title: '',
  description: '',
  price: '',
  promotionalPrice: '',
  category: ''
};

export function ProductModal({ product, onClose, onSave }) {
  const [formData, setFormData] = useState(initialFormState);
  const [imageError, setImageError] = useState('');

  const modalTitle = useMemo(() => (product ? 'Editar produto' : 'Adicionar produto'), [product]);

  useEffect(() => {
    if (product) {
      setFormData({
        image: product.image ?? '',
        title: product.title ?? '',
        description: product.description ?? '',
        price: product.price ?? '',
        promotionalPrice: product.promotionalPrice ?? '',
        category: product.category ?? ''
      });
    }
  }, [product]);

  function updateField(field, value) {
    setFormData((currentData) => ({ ...currentData, [field]: value }));
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];
    setImageError('');

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setImageError('Selecione um arquivo de imagem válido.');
      return;
    }

    if (file.size > 1024 * 1024) {
      setImageError('A imagem deve ter no máximo 1MB para evitar exceder o localStorage.');
      return;
    }

    const imageBase64 = await fileToBase64(file);
    updateField('image', imageBase64);
  }

  function handleSubmit(event) {
    event.preventDefault();

    const parsedPrice = Number(formData.price || 0);
    const parsedPromotionalPrice = formData.promotionalPrice === '' ? '' : Number(formData.promotionalPrice);

    onSave({
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      price: parsedPrice,
      promotionalPrice: parsedPromotionalPrice
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal__header">
          <div>
            <span>Produtos</span>
            <h2 id="product-modal-title">{modalTitle}</h2>
          </div>
          <button type="button" className="modal__close" aria-label="Fechar modal" onClick={onClose}>
            ×
          </button>
        </header>

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="image-uploader">
            {formData.image ? (
              <img src={formData.image} alt="Prévia do produto" />
            ) : (
              <div className="image-uploader__placeholder">
                <span>Imagem</span>
                <small>PNG, JPG ou WEBP até 1MB</small>
              </div>
            )}

            <label className="button button--secondary">
              Escolher imagem
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>

            {formData.image && (
              <button type="button" className="button button--ghost" onClick={() => updateField('image', '')}>
                Remover imagem
              </button>
            )}

            {imageError && <p className="form-error">{imageError}</p>}
          </div>

          <div className="form-grid">
            <label>
              Título
              <input
                type="text"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Ex.: Xis Salada"
                required
              />
            </label>

            <label>
              Categoria
              <input
                type="text"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
                placeholder="Ex.: Bebidas, Mercado, Lanches"
                required
              />
            </label>

            <label>
              Valor
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(event) => updateField('price', event.target.value)}
                placeholder="0,00"
                required
              />
            </label>

            <label>
              Valor promocional
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.promotionalPrice}
                onChange={(event) => updateField('promotionalPrice', event.target.value)}
                placeholder="Opcional"
              />
            </label>
          </div>

          <label>
            Descrição
            <textarea
              rows="4"
              value={formData.description}
              onChange={(event) => updateField('description', event.target.value)}
              placeholder="Descreva o produto, tamanho, sabor, embalagem ou observações."
              required
            />
          </label>

          <footer className="modal__footer">
            <button type="button" className="button button--secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="button button--primary">
              Salvar produto
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
