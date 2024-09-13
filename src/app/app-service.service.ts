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

  //usr api
  postUserDataForRegister(data:any):Observable<any> {
    return this.http.post(`${this.serverUrl}/sign-up`,data);
  };

  postUserCheck(data:any):Observable<any> {
    return this.http.post(`${this.serverUrl}/checkUser`,data);
  }

  checkUserName(data:any):Observable<any> {
    return this.http.post(`${this.serverUrl}/checkUserName`,data);
  }
  
  addUpdateAdress(data:any):Observable<any> {
    return this.http.post(`${this.serverUrl}/add-update-address`,data);
  }

  updateRole(data:any):Observable<any> {
    return this.http.post(`${this.serverUrl}/update-role`,data);
  }

  //bill api
  postImage(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/upload-print`,data);
  }

  getTees(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/fetch-tees`,data);
  }

  deleteTees(data:any): Observable<any> {
    console.log(data,'data');
    return this.http.post(`${this.serverUrl}/delete-tees/`+data,data);
  }
  
  // razor api
  createOrder(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/paymentOrder`,data);
  }

  // coupon api
  createCoupon(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/create-coupon`,data);
  }

  getCoupon(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/get-coupon`,data);
  }

  deleteCoupon(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/delete-coupon/`,data);
  }

  //help api
  postQuestion(data:any): Observable<any> {
    return this.http.post(`${this.serverUrl}/post-question`,data);
  }
}
