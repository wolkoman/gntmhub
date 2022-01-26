export function calculateStockPrice(stockIndex: number): number {
    return 0.9 + stockIndex / 10;
}

export function calculatePrice(
    stockIndex: number,
    amount: number
) {
    return Math.sign(amount) * Array(Math.abs(amount))
        .fill(0)
        .map((_, index) =>
            calculateStockPrice(amount > 0
                ? stockIndex + index + 1
                : stockIndex - index)
        )
        .reduce((p, c) => p + c, 0);
}

export function calculateStocksForPrice(
    stockIndex: any,
    price: number
) {
    let amount = 1;
    while (calculatePrice(stockIndex, amount) <= price) {
        amount++;
    }
    return amount - 1;
}

export function price(value: number, hidePoints?: boolean) {
    return Math.round(value*100)/100 + (hidePoints?"":"g-points");
}