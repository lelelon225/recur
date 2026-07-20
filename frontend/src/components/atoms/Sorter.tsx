import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";
import { type SortOptions, SORT_OPTIONS } from "@/utils/sortTasks";

type SorterProps = {
  sortBy: SortOptions;
  setSortBy: (value: SortOptions) => void;
};

function Sorter({ sortBy, setSortBy }: SorterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="sortBy" className="sr-only">
        Sortieren nach
      </Label>
      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOptions)}>
        <SelectTrigger id="sortBy" className="w-full gap-2 sm:w-[200px]">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <SelectValue>
            {(value: SortOptions) =>
              SORT_OPTIONS.find((option) => option.value === value)?.label
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default Sorter;