import { Crime } from "./crime";

export interface wantedRes {
    items: Crime[],
    page: number,
    total: number
}