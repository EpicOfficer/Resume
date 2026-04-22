export function formatDate(dateString: string | null | undefined): string {
    if (dateString) {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = {year: 'numeric', month: 'long'};
        return date.toLocaleDateString('en-GB', options);
    }

    return "";
}