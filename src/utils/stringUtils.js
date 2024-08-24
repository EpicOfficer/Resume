export function sanitizeTitle(title) {
    return title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? "resume";
}