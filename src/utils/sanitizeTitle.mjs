// src/utils/sanitizeTitle.js

/**
 * Sanitizes a title by replacing non-alphanumeric characters with underscores and converting to lowercase
 * @param {string} title - The title to sanitize
 * @return {string} - The sanitized title
 */
export function sanitizeTitle(title) {
    return title?.replace(/[^a-z0-9]/gi, '_').toLowerCase() ?? "resume";
}