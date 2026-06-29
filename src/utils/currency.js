export function formatCurrency(value) {
  const numericValue = Number(value || 0);

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(numericValue);
}
