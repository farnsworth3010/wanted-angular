import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WantedService {
  constructor(private http: HttpClient, private router: Router) {}
  private url: string = "https://api.fbi.gov/wanted/v1/list";
  page: number = 1;
  data: any;
  fetching: boolean = true
  selectedPerson: any;
  pages: number = 0;
  length: number = 0;
  filters!: {};
  stateItem: BehaviorSubject<any> = new BehaviorSubject(null);
  stateItem$: Observable<any> = this.stateItem.asObservable();
  pageItem: BehaviorSubject<number> = new BehaviorSubject(this.page);
  pageItem$: Observable<number> = this.pageItem.asObservable();
  getData() {
    return this.http.get(this.url, {
      params: {
        page: this.page,
        ...this.filters,
      },
    });
  }
  updateFilters(filters: any) {
    this.page = 1
    this.filters = filters
  }
}
