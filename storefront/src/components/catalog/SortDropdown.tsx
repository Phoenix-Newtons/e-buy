import type { ReactElement } from "react";
import { ArrowUpDown } from "lucide-react";
import { SORT_OPTIONS } from "../../data/constants";
import type { SortKey } from "../../types";
import { Select, type SelectOption } from "../ui/Select";

export interface SortDropdownProps {
  value: SortKey;
  onChange: (value: SortKey) => void;
}

const OPTIONS: readonly SelectOption<SortKey>[] = SORT_OPTIONS.map((option) => ({
  value: option.id,
  label: option.label,
  icon: option.icon,
}));

export function SortDropdown({ value, onChange }: SortDropdownProps): ReactElement {
  return (
    <Select<SortKey>
      label="Sort listings"
      variant="pill"
      icon={ArrowUpDown}
      align="right"
      options={OPTIONS}
      value={value}
      onChange={onChange}
      className="w-52"
    />
  );
}
