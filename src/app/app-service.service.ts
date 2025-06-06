import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment';

@Injectable({
    providedIn: 'root',
})
export class AppServiceService {
    constructor(private http: HttpClient) { }
    private serverUrl: string = environment.backend;

    //usr api
    postUserDataForRegister(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/sign-up`, data);
    }

    postUserCheck(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/checkUser`, data);
    }

    checkUserName(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/checkUserName`, data);
    }

    addUpdateAdress(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/add-update-address`, data);
    }

    updateRole(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/update-role`, data);
    }
    checkRole(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/check-role`, data);
    }

    getCoins(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/get-user-coins`, data);
    }

    //bill api
    postImage(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/upload-print`, data);
    }

    getItems(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/get-items`, data);
    }

    deleteDesign(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/delete-design`, data);
    }

    getOnetee(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/get-one-tee`, data);
    }

    // razor api
    createOrder(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/paymentOrder`, data);
    }
    verify(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/verify-payment`, data);
    }

    // coupon api
    createCoupon(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/create-coupon`, data);
    }

    getCoupon(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/get-coupon`, data);
    }

    deleteCoupon(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/delete-coupon`, data);
    }

    //help api
    postQuestion(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/post-question`, data);
    }

    // order api
    postOrder(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/place-order`, data);
    }

    getOrder(data: any): Observable<any> {
        return this.http.post(`${this.serverUrl}/orders`, data);
    }

    getAllOrder(data: any) {
        return this.http.post(`${this.serverUrl}/orderAll`, data);
    }
    updateOrder(data: any) {
        return this.http.post(`${this.serverUrl}/update-order`, data);
    }

    // pincode apis
    getAddressByPincode(pincode: string): Observable<any> {
        return this.http.get(` https://api.postalpincode.in/pincode/${pincode}`);
    }

    getPincode(data: any) {
        return this.http.get(`${this.serverUrl}/nimbus/check-pincode-availabilty`, { params: data });
    }

    // otp apis
    sendOtp(email: string) {
        return this.http.post(`${this.serverUrl}/send-otp`, { email });
    }

    verifyOtp(email: string, otp: string) {
        return this.http.post(`${this.serverUrl}/verify-otp`, { email, otp });
    }

    //inventory apis
    getInventory() {
        return this.http.get(`${this.serverUrl}/get-inventory`);
    }
}
