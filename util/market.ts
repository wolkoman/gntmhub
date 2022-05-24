export function calculateStockPrice(stockIndex: number, remaining: number = 5): number {
    console.log("rem", remaining)
    return Math.max(0,5-remaining) * 10 + 0.9 + stockIndex / 10;
}

export function calculatePrice(
    stockIndex: number,
    amount: number,
    remaining: number
) {
    return Math.sign(amount) * Array(Math.abs(amount))
        .fill(0)
        .map((_, index) =>
            calculateStockPrice(amount > 0
                ? stockIndex + index + 1
                : stockIndex - index, remaining)
        )
        .reduce((p, c) => p + c, 0);
}

export function calculateStocksForPrice(
    stockIndex: any,
    price: number,
    remaining: number
) {
    let amount = 1;
    while (calculatePrice(stockIndex, amount, remaining) <= price || amount === 11) {
        amount++;
    }
    return amount - 1;
}

export function price(value: number, hidePoints?: boolean) {
    return Math.round(value*100)/100 + (hidePoints?"":" g-points");
}

export function payout(date = new Date()) {
    const now = date.getTime();
    const begin = new Date("2022-02-02T18:00:00+01:00").getTime();
    if(begin > now) return 0;
    const payoutSize = 10;
    const passedDays = Math.floor(Math.max(0,now - begin) / (1000 * 60 * 60 * 24));
    const saturdaysPassed = Math.floor((passedDays+4) / 7);
    const sundaysPassed = Math.floor((passedDays+3) / 7);
    const diff = Math.min((passedDays - (saturdaysPassed + sundaysPassed)) * payoutSize, 500);
    return diff;
}