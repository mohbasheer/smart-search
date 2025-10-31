export type ComponentType = "checkbox" | "dropdown" | "date-picker";

export interface FilterOptions {
  id: string;
  label: string;
  value: string;
}
export interface FilterConfig {
  filterId: string;
  componentType: ComponentType;
  label: string;
  options?: FilterOptions[];
  defaultValue?: string | boolean;
  handler: <T>(values: T[], filterValue: string | boolean) => T[];
}
