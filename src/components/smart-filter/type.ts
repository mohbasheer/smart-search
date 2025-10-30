export type ComponentType = "checkbox" | "dropdown" | "date-picker";

export interface FilterConfig {
  filterId: string;
  componentType: ComponentType;
  label: string;
}
