import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

export const Default = () => {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 8, 8)
  );
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 8, 1)}
      className="rounded-xl border border-border"
    />
  );
};

export const Range = () => {
  const [range, setRange] = React.useState<
    { from: Date; to?: Date } | undefined
  >({ from: new Date(2026, 8, 8), to: new Date(2026, 8, 14) });
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2026, 8, 1)}
      className="rounded-xl border border-border"
    />
  );
};
