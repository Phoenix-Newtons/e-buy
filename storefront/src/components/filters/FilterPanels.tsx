import type { Dispatch, ReactElement } from "react";
import { BadgeCheck, LayoutGrid, PackageCheck, Wallet } from "lucide-react";
import { CATEGORIES, CATEGORY_TONE_CLASSES, CONDITIONS, VERIFICATIONS } from "../../data/constants";
import { isPriceFilterActive } from "../../lib/catalog";
import { cn } from "../../lib/cn";
import type { CategoryId, FilterAction, FilterState } from "../../types";
import { AccordionPanel } from "../ui/Accordion";
import { ChoiceRow } from "../ui/ChoiceRow";
import { PriceRangeSlider } from "../ui/PriceRangeSlider";

export interface FilterPanelsProps {
  filters: FilterState;
  dispatch: Dispatch<FilterAction>;
  categoryCounts: Readonly<Record<CategoryId, number>>;
  /** Unique prefix so ids stay unique when the panels render in both sidebar and drawer. */
  idPrefix: string;
}

/** The four accordion panels shared by the desktop sidebar and the mobile drawer. */
export function FilterPanels({ filters, dispatch, categoryCounts, idPrefix }: FilterPanelsProps): ReactElement {
  return (
    <div>
      <AccordionPanel title="Category" icon={LayoutGrid} defaultOpen activeCount={filters.category === "all" ? 0 : 1}>
        <div role="radiogroup" aria-label="Category" className="-mx-1 space-y-0.5">
          <ChoiceRow
            type="radio"
            name={`${idPrefix}-category`}
            checked={filters.category === "all"}
            onChange={() => dispatch({ type: "setCategory", category: "all" })}
            label="All categories"
          />
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <ChoiceRow
                key={category.id}
                type="radio"
                name={`${idPrefix}-category`}
                checked={filters.category === category.id}
                onChange={() => dispatch({ type: "setCategory", category: category.id })}
                label={category.label}
                trailing={categoryCounts[category.id]}
                leading={
                  <span
                    aria-hidden="true"
                    className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1", CATEGORY_TONE_CLASSES[category.tone].badge)}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                }
              />
            );
          })}
        </div>
      </AccordionPanel>

      <AccordionPanel title="Item condition" icon={PackageCheck} defaultOpen activeCount={filters.conditions.length}>
        <fieldset className="-mx-1 space-y-0.5">
          <legend className="sr-only">Item condition</legend>
          {CONDITIONS.map((condition) => (
            <ChoiceRow
              key={condition.id}
              type="checkbox"
              checked={filters.conditions.includes(condition.id)}
              onChange={() => dispatch({ type: "toggleCondition", condition: condition.id })}
              label={condition.label}
              description={condition.description}
            />
          ))}
        </fieldset>
      </AccordionPanel>

      <AccordionPanel title="Price (UGX)" icon={Wallet} defaultOpen activeCount={isPriceFilterActive(filters) ? 1 : 0}>
        <PriceRangeSlider
          idPrefix={`${idPrefix}-price`}
          min={filters.priceMin}
          max={filters.priceMax}
          onChange={(min, max) => dispatch({ type: "setPriceRange", min, max })}
        />
      </AccordionPanel>

      <AccordionPanel title="Verifications" icon={BadgeCheck} activeCount={filters.verifications.length}>
        <fieldset className="-mx-1 space-y-0.5">
          <legend className="sr-only">Seller verifications</legend>
          {VERIFICATIONS.map((verification) => {
            const Icon = verification.icon;
            return (
              <ChoiceRow
                key={verification.id}
                type="checkbox"
                checked={filters.verifications.includes(verification.id)}
                onChange={() => dispatch({ type: "toggleVerification", verification: verification.id })}
                label={verification.label}
                description={verification.description}
                leading={<Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-brand" />}
              />
            );
          })}
        </fieldset>
      </AccordionPanel>
    </div>
  );
}
