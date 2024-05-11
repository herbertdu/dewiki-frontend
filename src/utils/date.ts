export function formatTimestamp(timestamp: number): any {
    let date = new Date(timestamp);
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    let language = navigator.language || 'en-US';
    let formattedDate = new Intl.DateTimeFormat(language, {
        dateStyle: 'long',
        timeStyle: 'long',
        timeZone: timeZone,
    }).format(date);
    return formattedDate;
}
