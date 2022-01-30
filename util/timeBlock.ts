export function getCurrentTimeBlock() {
    const blockLength = 1000 * 60 * 60;
    return Math.floor(new Date().getTime() / blockLength) * blockLength;
}