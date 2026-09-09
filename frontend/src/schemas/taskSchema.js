import * as yup from "yup";
import { TaskCategory, TaskFrequency } from "@/services/taskService";
export const taskValidationSchema = yup.object({
    name: yup
        .string()
        .trim()
        .min(2, "Name muss mindestens 2 Zeichen lang sein")
        .max(40, "Name darf maximal 40 Zeichen lang sein")
        .required("Name ist erforderlich"),
    description: yup
        .string()
        .trim()
        .max(200, "Beschreibung darf maximal 200 Zeichen lang sein")
        .required("Beschreibung ist erforderlich"),
    category: yup
        .string()
        .oneOf(Object.values(TaskCategory))
        .required("Kategorie ist erforderlich"),
    frequency: yup
        .string()
        .oneOf(Object.values(TaskFrequency))
        .required("Frequenz ist erforderlich"),
    dateUntil: yup
        .date()
        .required("Fälligkeitsdatum ist erforderlich")
        .min(yup.ref("startDate"), "Fälligkeitsdatum muss nach dem Startdatum liegen"),
    durationMinutes: yup
        .number()
        .min(1, "Dauer muss mindestens 1 Minute betragen"),
    startDate: yup
        .date()
        .required("Startdatum ist erforderlich")
        .test("future", "Startdatum muss in der Zukunft liegen", (value) => {
        if (!value)
            return false;
        return value.getTime() >= Date.now();
    }),
    startTimeOfDay: yup
        .string()
        .required("Startzeit ist erforderlich")
        .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Ungültiges Zeitformat (Format muss HH:mm sein)")
        .test("min-time", "Die Zeit muss ab 08:00 Uhr liegen", (value) => {
        if (!value)
            return false;
        return value >= "08:00";
    })
        .test("max-time", "Die Zeit muss vor oder um 23:00 Uhr liegen", (value) => {
        if (!value)
            return false;
        return value <= "23:00";
    }),
});
