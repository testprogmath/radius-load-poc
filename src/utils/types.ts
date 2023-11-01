export function isUuid(uuid: string): boolean {
    const uuidRegex: RegExp = new RegExp(
        '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$'
    );
    return uuidRegex.test(uuid);
}


export function formatDate(date: Date) {
    date.setUTCHours(0, 0, 0, 0);

    let newDateString = date.toISOString();
    return newDateString.replace(/\.\d{3}Z$/, '');
}