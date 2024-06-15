import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  constructor(private http:HttpClient) { }
  private serverUrl:string=environment.backend;

  //bill api
  postCompnayBill(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/add-bill`,data);
  }

  getCompnayBill(): Observable<any> {
    return this.http.get(`${this.serverUrl}/fetch-bill`);
  }

  //invt api
  postInventorydata(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/add-item`,data);
  }
  
  getInventorydata(): Observable<any> {
    return this.http.get(`${this.serverUrl}/fetch-item`);
  }

}
