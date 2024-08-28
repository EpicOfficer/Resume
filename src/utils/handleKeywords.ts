export const handleKeywords = (keywords?: readonly (string | null)[] | null) => {
    return keywords ? [...keywords] : [];
};