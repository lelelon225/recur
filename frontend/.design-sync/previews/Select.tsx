import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CATEGORY_ITEMS = [
  { value: "WORK", label: "Arbeit" },
  { value: "PERSONAL", label: "Persönlich" },
  { value: "SCHOOL", label: "Schule" },
  { value: "OTHER", label: "Andere" },
];

const FREQUENCY_ITEMS = [
  { value: "DAILY", label: "Täglich" },
  { value: "WEEKLY", label: "Wöchentlich" },
  { value: "MONTHLY", label: "Monatlich" },
  { value: "YEARLY", label: "Jährlich" },
  { value: "ONCE", label: "Einmalig" },
];

export const Default = () => (
  <Select items={CATEGORY_ITEMS}>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Wähle eine Kategorie" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {CATEGORY_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const Open = () => (
  <Select items={FREQUENCY_ITEMS} defaultValue="WEEKLY" defaultOpen>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Wähle eine Frequenz" />
    </SelectTrigger>
    <SelectContent alignItemWithTrigger={false}>
      <SelectGroup>
        <SelectLabel>Frequenz</SelectLabel>
        <SelectSeparator />
        {FREQUENCY_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const SmallSize = () => (
  <Select items={CATEGORY_ITEMS} defaultValue="PERSONAL">
    <SelectTrigger size="sm" className="w-40">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {CATEGORY_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const Disabled = () => (
  <Select items={CATEGORY_ITEMS} disabled>
    <SelectTrigger className="w-48">
      <SelectValue placeholder="Wähle eine Kategorie" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {CATEGORY_ITEMS.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
