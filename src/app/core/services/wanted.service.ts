import { collection, deleteDoc, doc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { getDocs } from 'firebase/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { Crime } from '../interfaces/crime';
import { Filters, FiltersHTTPParam } from '../interfaces/filters';
import { environment } from '../../../environments/environment';
import { WantedRes } from '../interfaces/wanted-result';
import { CustomField } from '../interfaces/custom-field';

@Injectable({
  providedIn: 'root',
})
export class WantedService {
  constructor(private http: HttpClient, private afs: AngularFirestore) {}
  editsOpenedFromGlobal: boolean = false;
  selectedPerson: null | Crime = null;
  data: null | Crime[] = null;
  fetching: boolean = false;
  length: number = 0;
  pages: number = 0;
  page: number = 1;
  filters: Filters | null = null;
  pageItem: BehaviorSubject<number> = new BehaviorSubject(this.page);
  pageItem$: Observable<number> = this.pageItem.asObservable();
  getData(): Observable<WantedRes> {
    this;
    let filters!: FiltersHTTPParam;
    // reduce
    for (let key in this.filters) {
      if (this.filters[key] !== null) {
        filters[key] = this.filters[key]!;
      }
    }
    return this.http.get<WantedRes>(environment.apiUrl, {
      params: {
        page: this.page,
        ...filters,
      },
    });
  }
  getEdited(): Observable<DocumentData> {
    return from(getDocs(collection(this.afs.firestore, 'edited')));
  }
  updateFilters(filters: Filters | null): void {
    this.page = 1;
    this.filters = filters;
  }
  deleteEditedById(id: string): Observable<void> {
    return from(deleteDoc(doc(this.afs.firestore, `edited/${id}`)));
  }
  uploadEdited(
    uid: string,
    data: Crime,
    newData: {
      title: string;
      sex: string;
      hair: string;
      race: string;
      eyes: string;
      reward_text: string;
      customFields: any[];
    }
  ): Observable<any> {
    return from(
      this.afs
        .collection('edited')
        .doc(uid)
        .set({
          ...data,
          ...newData,
        })
    );
  }
  updateData(res: WantedRes): void {
    this.selectedPerson = res.items[0];
    this.length = res.total;
    this.data = res.items;
    this.pages = res.page;
    this.fetching = false;
  }
}
