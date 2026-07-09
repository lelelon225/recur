import * as yup from "yup";
import { TaskCategory, TaskFrequency } from "@/services/taskService";

export const taskValidationSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name muss mindestens 2 Zeichen lang sein")
    .max(20, "Name darf maximal 20 Zeichen lang sein")
    .required("Name ist erforderlich"),

  description: yup
    .string()
    .trim()
    .max(50, "Beschreibung darf maximal 50 Zeichen lang sein")
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
    .test(
      "future",
      "Fälligkeitsdatum muss in der Zukunft liegen",
      (value) => {
        if (!value) return false;
        return value.getTime() > Date.now();
      }
    ),
});