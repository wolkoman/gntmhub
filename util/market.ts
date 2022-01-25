export function calculateStockPrice(stockIndex: number): number {
    return 1+ + stockIndex / 10;
}

export function calculatePrice(
    stockTotal: any,
    candidateId: string,
    amount: number
) {
    return Array(Math.abs(amount))
        .fill(stockTotal)
        .map((total, index) =>
            calculateStockPrice(amount > 0 ? total + index + 1 : total - index)
        )
        .reduce((p, c) => (amount > 0 ? p + c : p - c), 0);
}

export function calculateStocksForPrice(
    stocks: any,
    candidateId: string,
    price: number
) {
    let amount = 1;
    while(calculatePrice(stocks, candidateId, amount) <= price){
        amount++;
    }
    return amount - 1;
}