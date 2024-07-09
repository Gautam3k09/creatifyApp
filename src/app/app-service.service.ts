import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AppServiceService {
  constructor(private http:HttpClient) { }
  private serverUrl:string=environment.backend;

  //bill api
  postImage(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/upload-print`,data);
  }

  getCompnayBill(): Observable<any> {
    return this.http.get(`${this.serverUrl}/fetch-bill`);
  }

}
