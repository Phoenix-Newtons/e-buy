export type ClassValue = string | false | null | undefined;

/** Joins truthy class names. A tiny, dependency-free stand-in for `clsx`. */
export function cn(...values: readonly ClassValue[]): string {
  return values.filter((value): value is string => typeof value === "string" && value.length > 0).join(" ");
}
