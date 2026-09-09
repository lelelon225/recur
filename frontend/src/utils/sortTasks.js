export const SORT_OPTIONS = [
    { value: "date ascending", label: "Datum aufsteigend" },
    { value: "date descending", label: "Datum absteigend" },
    { value: "progress ascending", label: "Fortschritt aufsteigend" },
    { value: "progress descending", label: "Fortschritt absteigend" },
    { value: "alphabetical", label: "Alphabetisch" },
];
function sortTaskByDateCreatedDESC(tasks) {
    return [...tasks].sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
}
function sortTaskByDateCreatedASC(tasks) {
    return [...tasks].sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
}
function sortTaskByProgressASC(tasks) {
    return [...tasks].sort((a, b) => a.progress - b.progress);
}
function sortTaskByProgressDESC(tasks) {
    return [...tasks].sort((a, b) => b.progress - a.progress);
}
function sortTaskAlphabetically(tasks) {
    return [...tasks].sort((a, b) => a.name.localeCompare(b.name));
}
export function sortTasks(tasks, sortBy) {
    switch (sortBy) {
        case "progress ascending":
            return sortTaskByProgressASC(tasks);
        case "progress descending":
            return sortTaskByProgressDESC(tasks);
        case "alphabetical":
            return sortTaskAlphabetically(tasks);
        case "date ascending":
            return sortTaskByDateCreatedASC(tasks);
        case "date descending":
            return sortTaskByDateCreatedDESC(tasks);
        default:
            // Fallback, falls SortOptions künftig erweitert wird, ohne dass hier ein Case ergänzt wurde.
            return sortTaskByDateCreatedDESC(tasks);
    }
}
