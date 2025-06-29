import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class localStorageService {
    constructor() { }
    // localdata structure ->
    // LoggedIn Or Visitor
    // userData

    setUserLocalStorage(data: any) {
        localStorage.setItem('whoAmI', data);
    }

    getUserLocalStorage(): any {
        let data: any = localStorage.getItem('whoAmI');
        data = JSON.parse(data);
        return data;
    }
    removeUserLocalStorage() {
        localStorage.removeItem('whoAmI');
    }

    clearUserLocalStorage() {
        localStorage.clear();
    }
}
