import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class WantedService {
  constructor(private http: HttpClient) {}
  url = 'https://api.fbi.gov/wanted/v1/list';
  getData(page: number) {
    return this.http.get(this.url, {
      params: {
        page,
      },
    });
  }
}
