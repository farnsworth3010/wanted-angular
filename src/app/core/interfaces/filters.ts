export interface Filters {
  [key: string]: string | null;
}

export type FiltersHTTPParam = Record<keyof Filters, string>;
