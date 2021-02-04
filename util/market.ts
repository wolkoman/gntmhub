export function calculateStockPrice(stockIndex: number): number {
  //  return 1 + Math.pow(stockIndex,1.23)/10;
  return 1 + stockIndex / 10;
}

export function calculatePrice(
  stocks: any,
  candidateId: string,
  amount: number
) {
  const stockTotal = stocks[candidateId];
  return Array(Math.abs(amount))
    .fill(stockTotal)
    .map((total, index) =>
      calculateStockPrice(amount > 0 ? total + index + 1 : total - index)
    )
    .reduce((p, c) => (amount > 0 ? p + c : p - c), 0);
}
