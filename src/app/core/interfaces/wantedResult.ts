import { Crime } from './crime';

export interface WantedRes {
  items: Crime[];
  page: number;
  total: number;
}
