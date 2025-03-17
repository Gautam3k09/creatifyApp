import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { localStorageService } from '../local-storage-service';
import { LoaderComponent } from '../loader/loader.component';

@Component({
    selector: 'app-order-placed',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './order-placed.component.html',
    styleUrl: './order-placed.component.css',
})
export class OrderPlacedComponent {
    fromCod: any = false;
    finalPrice = 0;
    storeData: any;
    orderId: any;
    isLoading = false;
    constructor(
        private router: Router,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            from: any;
            buyPageData: any;
            userData: any;
            finalPrice: any;
            address: any;
            rpData: any;
        },
        public dialogRef: MatDialogRef<OrderPlacedComponent>,
        private appservice: AppServiceService,
        private localStorage: localStorageService
    ) {
        this.isLoading = true;
        this.storeData = this.localStorage.getUserLocalStorage();
    }

    ngOnInit() {
        if (this.data.from == 'cod') {
            this.fromCod = true;
            this.finalPrice = this.data.finalPrice + 59;
        } else {
            this.fromCod = false;
        }
        this.isLoading = false;
    }

    closeModal(string: any) {
        this.dialogRef.close(string);
    }

    redirectShop() {
        if (this.storeData.visitor == null) {
            this.closeModal('shop');
            this.router.navigate(['/shop']);
        } else {
            this.closeModal('shop');
            this.router.navigate([
                '/' + this.storeData.visitor + '/merch/' + this.data.buyPageData.user_Id,
            ]);
        }
    }

    placeOrder() {
        let data = {
            tshirtId: this.data.buyPageData._id,
            by:
                this.storeData.visitor == null
                    ? this.data.userData.user_Name
                    : this.data.userData.phoneNumber,
            madeBy: this.data.buyPageData.user_Id,
            address: this.data.address,
            paymentMethod: this.fromCod ? 'COD' : 'ONLINE',
            tshirtPrice: this.data.buyPageData.price,
            finalPrice: this.finalPrice,
            // quantity : this.data.buyPageData.quantity,
            size: this.data.buyPageData.size,
            coinsUsed: this.data.buyPageData.coinsUsed,
            coupon: this.data.buyPageData.coupon,
        };
        this.appservice.postOrder(data).subscribe((result) => {
            if (result.status) {
                this.orderId = result.data;
                this.fromCod = false;
            }
        });
    }
}
