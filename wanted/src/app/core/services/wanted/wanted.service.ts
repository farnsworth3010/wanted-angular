import { collection, deleteDoc, doc } from "@angular/fire/firestore";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import { getDocs } from "firebase/firestore";
import { BehaviorSubject, Observable, from } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WantedService {
  constructor(private http: HttpClient, private router: Router, private afs: AngularFirestore) {}
  private url: string = "https://api.fbi.gov/wanted/v1/list";
  page: number = 1;
  data: any;
  fetching: boolean = false;
  selectedPerson: any;
  pages: number = 0;
  length: number = 0;
  filters!: {};
  stateItem: BehaviorSubject<any> = new BehaviorSubject(null);
  stateItem$: Observable<any> = this.stateItem.asObservable();
  pageItem: BehaviorSubject<number> = new BehaviorSubject(this.page);
  pageItem$: Observable<number> = this.pageItem.asObservable();
  editsOpenedFromGlobal: boolean = false
  getData() {
    return this.http.get(this.url, {
      params: {
        page: this.page,
        ...this.filters,
      },
    });
  }
  getEdited() {
    return from(getDocs(collection(this.afs.firestore, "edited")));
  }
  updateFilters(filters: any): void {
    this.page = 1;
    this.filters = filters;
  }
  deleteEditedById(id: string) {
    return from(deleteDoc(doc(this.afs.firestore, `edited/${id}`)));
  }
  updateData(res: any): void {
    this.selectedPerson = res.items[0];
    this.data = res.items;
    this.pages = res.page;
    this.length = res.total;
    this.fetching = false;
    this.stateItem.next(res.items);
  }
}
