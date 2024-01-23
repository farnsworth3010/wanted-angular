import { collection, deleteDoc, doc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentData } from '@angular/fire/compat/firestore';
import { getDocs } from 'firebase/firestore';
import { BehaviorSubject, Observable, from, of, switchMap, throwError } from 'rxjs';
import { Crime } from '../interfaces/crime';
import { Filters, FiltersHTTPParam } from '../interfaces/filters';
import { environment } from '../../../environments/environment';
import { WantedRes } from '../interfaces/wanted-result';
import { AuthService } from './auth.service';
import { FirebaseUser } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class WantedService {
  constructor(private http: HttpClient, private afs: AngularFirestore, private auth: AuthService) {}

  editsOpenedFromGlobalItem = new BehaviorSubject(false);
  editsOpenedFromGlobalItem$ = this.editsOpenedFromGlobalItem.asObservable();

  fetchingItem: BehaviorSubject<boolean> = new BehaviorSubject(false);
  fetchingItem$ = this.fetchingItem.asObservable();

  pageItem: BehaviorSubject<number> = new BehaviorSubject(1);
  pageItem$: Observable<number> = this.pageItem.asObservable();

  selectedPerson: null | Crime = null;
  data: null | Crime[] = null;
  length: number = 0;
  pages: number = 0;
  filters: Filters | null = null;

  getData(): Observable<WantedRes> {
    this;
    let filters: FiltersHTTPParam = {};

    if (this.filters !== null) {
      const applied_filters = Object.keys(this.filters!);
      applied_filters.forEach((filter: string) => {
        if (this.filters![filter]) {
          filters[filter] = this.filters![filter]!;
        }
      });
    }

    return this.http.get<WantedRes>(environment.apiUrl, {
      params: {
        page: this.pageItem.value,
        ...filters,
      },
    });
  }

  getEdited(): Observable<DocumentData> {
    return from(this.auth.afAuth.currentUser).pipe(
      switchMap((user: FirebaseUser | null) => {
        if (user) {
          return getDocs(collection(this.afs.firestore, `edited/USER_${user?.uid}/criminals`));
        }
        return of([]) 
      })
    );
  }

  updateFilters(filters: Filters | null): void {
    this.pageItem.next(1);
    this.filters = filters;
  }

  deleteEditedById(id: string): Observable<void> {
    return from(this.auth.afAuth.currentUser).pipe(
      switchMap((user: FirebaseUser | null) => {
        if (user) {
          return deleteDoc(doc(this.afs.firestore, `edited/USER_${user.uid}/criminals/${id}`));
        }
        return throwError(() => new Error('Error while deleting'));
      })
    );
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
    return from(this.auth.afAuth.currentUser).pipe(
      switchMap((user: FirebaseUser | null) => {
        if (user) {
          return this.afs
            .collection('edited')
            .doc('USER_' + user.uid)
            .collection('criminals')
            .doc(uid)
            .set({
              ...data,
              ...newData,
            });
        }
        return throwError(() => new Error('Error while editing'));
      })
    );
  }

  updateData(res: WantedRes): void {
    this.selectedPerson = res.items[0];
    this.length = res.total;
    this.data = res.items;
    this.pages = res.page;
    this.fetchingItem.next(false);
  }
}
