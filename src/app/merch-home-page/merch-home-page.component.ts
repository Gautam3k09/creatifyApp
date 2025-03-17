import { Component } from '@angular/core';
import { YourTeesComponent } from '../your-tees/your-tees.component';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonShopComponent } from '../common-shop/common-shop.component';
import { localStorageService } from '../local-storage-service';
@Component({
    selector: 'app-merch-home-page',
    standalone: true,
    imports: [HeaderPageComponent, YourTeesComponent, CommonShopComponent],
    templateUrl: './merch-home-page.component.html',
    styleUrl: './merch-home-page.component.css',
})
export class MerchHomePageComponent {
    isMerchHomePage = false;
    merchantName: any = '';
    constructor(
        private router: Router,
        public appService: AppServiceService,
        route: ActivatedRoute,
        private localStorage: localStorageService
    ) {
        this.localStorage.clearUserLocalStorage();
        this.merchantName = route.snapshot.params['userName'];
        let link: any = route.snapshot.params['userId'];
        let data: any = {
            visitor: this.merchantName,
            user_id: link,
        };
        data = JSON.stringify(data);
        this.localStorage.setUserLocalStorage(data);
    }
    ngOnInit() {
        this.appService.checkRole({ user_Name: this.merchantName }).subscribe((response) => {
            if (response.status) {
                console.log(response);
            } else {
                this.router.navigate(['']);
            }
        });
    }
}
