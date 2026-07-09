import * as yup from "yup";

export const taskValidationSchema = yup.object().shape({
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
  category: yup.string().required("Kategorie ist erforderlich"),
  frequency: yup.string().required("Frequenz ist erforderlich"),
  dateUntil: yup
    .date()
    .required("Fälligkeitsdatum ist erforderlich")
    .min(new Date(), "Fälligkeitsdatum muss in der Zukunft liegen"),
});