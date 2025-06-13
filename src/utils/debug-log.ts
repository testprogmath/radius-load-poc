export function debugLog(message: any, ...optionalParams: any[]): void {
    if (process.argv.includes("--debug")) {
        console.log(message, ...optionalParams);
    }
}