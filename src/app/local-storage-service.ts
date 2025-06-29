import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class localStorageService {
    constructor() { }

    // Save user data (automatically stringify)
    setUserLocalStorage(data: any) {
        localStorage.setItem('whoAmI', JSON.stringify(data)); // ✅ Fix here
    }

    // Get user data (automatically parse)
    getUserLocalStorage(): any {
        const data = localStorage.getItem('whoAmI');
        return data ? JSON.parse(data) : null;
    }

    removeUserLocalStorage() {
        localStorage.removeItem('whoAmI');
    }

    clearUserLocalStorage() {
        localStorage.clear();
    }
}
