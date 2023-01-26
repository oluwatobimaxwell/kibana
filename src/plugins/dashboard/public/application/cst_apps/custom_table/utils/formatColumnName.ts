export const formatColumnName = (name: string): string => {
    const formattedName = name.replace(/_/g, ' ');
    return formattedName.toUpperCase();
};