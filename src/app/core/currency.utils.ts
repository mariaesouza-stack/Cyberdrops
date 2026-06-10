const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function normalizeCurrency(value: unknown): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? Math.round(number * 100) / 100 : 0;
}

export function formatCurrency(value: unknown): string {
  return brlFormatter.format(normalizeCurrency(value));
}

export function formatDiscount(value: unknown): string {
  const discount = Math.max(0, Math.round(Math.abs(Number(value) || 0)));
  return `${discount}% OFF`;
}
