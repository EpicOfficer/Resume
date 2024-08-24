export function sanitizeTitle(title: string | null): string {
    return title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? "resume";
}