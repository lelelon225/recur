export function formatDate(d) {
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date.toLocaleDateString("de-DE");
}
/** Formatiert ein Date-Objekt als reinen Datums-String (YYYY-MM-DD), ohne die Zeitzonen-Verschiebung, die toISOString() verursachen würde. */
export function toDateOnlyString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
