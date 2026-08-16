export function formatCurrency(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function formatWeight(kg: number): string {
  if (kg >= 1000) {
    return (kg / 1000).toFixed(1) + ' tonnes';
  }
  return Math.round(kg).toLocaleString() + ' kg';
}

export function formatNumber(num: number): string {
  return Math.round(num).toLocaleString();
}
