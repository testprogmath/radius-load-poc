export function generateShelfId(): string {
    return (Math.floor(Math.random() * 20) + 1).toString();
}