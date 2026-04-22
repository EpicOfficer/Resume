/**
 * Sanitizes a title by replacing non-alphanumeric characters (excluding hyphens) with underscores,
 * trimming leading/trailing spaces, and converting to lowercase
 * @param {string} title - The title to sanitize
 * @return {string} - The sanitized title
 */
export function sanitizeTitle(title) {
    // Trim the title to remove leading and trailing spaces
    title = title.trim();

    if (!title) return "resume";
    
    // Replace non-alphanumeric characters, excluding hyphens, with underscores
    return title.replace(/[^a-z0-9-]/gi, '_').toLowerCase();
}