export function getCurrentTimeBlock() {
    const blockLength = 1000 * 60 * 60;
    console.log(new Date().getTime(), Math.floor(new Date().getTime() / blockLength) * blockLength);
    return Math.floor(new Date().getTime() / blockLength);
}