import { Search } from "lucide-react";
import FormTextField from "@/components/molecules/FormTextField";

export const Default = () => (
  <div className="w-72">
    <FormTextField name="name" label="Name" value="" />
  </div>
);

export const Filled = () => (
  <div className="w-72">
    <FormTextField name="name" label="Name" value="Morgenlauf" />
  </div>
);

export const ErrorState = () => (
  <div className="w-72">
    <FormTextField
      name="name"
      label="Name"
      value=""
      error
      helperText="Name wird benötigt."
      required
    />
  </div>
);

export const WithAdornment = () => (
  <div className="w-72">
    <FormTextField
      name="search"
      label="Habits durchsuchen"
      value="Lesen"
      endAdornment={<Search className="h-4 w-4 text-muted-foreground" />}
    />
  </div>
);
