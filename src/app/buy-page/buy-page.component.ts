import { Component, OnInit } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WindowRefService } from '../window-ref.service';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderStepperComponent } from '../order-stepper/order-stepper.component';
import { ReferralPageComponent } from '../referral-page/referral-page.component';
import { localStorageService } from '../local-storage-service';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { environment } from '../../../environment';

@Component({
    selector: 'app-buy-page',
    standalone: true,
    imports: [CommonModule, HeaderPageComponent, ReactiveFormsModule, FormsModule, LoaderComponent],
    templateUrl: './buy-page.component.html',
    styleUrl: './buy-page.component.css',
    providers: [WindowRefService, AppServiceService],
})
export class BuyPageComponent implements OnInit {
    tshirtId: any;
    data: any = [];
    activeSizeBtn: any = 'S';
    openCouponInput: any = false;
    enteredCouponInput: any = '';
    couponData: any = [];
    discountedPrice: any = '';
    modalDialog: MatDialogRef<OrderStepperComponent, any> | undefined;
    modalDialogforReferral: MatDialogRef<ReferralPageComponent, any> | undefined;
    imageFrontUrls = [
        { key: 'Onyx black', value: 'assets/Tees/black-f.png' },
        { key: 'Pearl white', value: 'assets/Tees/white-f.png' },
        { key: 'Sapphire blue', value: 'assets/Tees/blue-f.png' },
        { key: 'Ruby maroon', value: 'assets/Tees/maroon-f.png' },
    ];
    imageBackUrls = [
        { key: 'Onyx black', value: 'assets/Tees/black-b.png' },
        { key: 'Pearl white', value: 'assets/Tees/white-b.png' },
        { key: 'Sapphire blue', value: 'assets/Tees/blue-b.png' },
        { key: 'Ruby maroon', value: 'assets/Tees/maroon-b.png' },
    ];
    user_Id: any;
    currentSide: any = 'front'
    visitorData: any = [];
    isChecked: any = false;
    coins: any;
    showContent: boolean = true;
    isLoading: boolean = false;
    isActive: boolean = true;
    cloudflareSharp = environment.cloudflareSharp;
    constructor(
        public bsModalRef: BsModalRef,
        private winRef: WindowRefService,
        private appservice: AppServiceService,
        private route: ActivatedRoute,
        private router: Router,
        public matDialog: MatDialog,
        public localStorage: localStorageService
    ) {
        let data = this.localStorage.getUserLocalStorage();
        if (data && data.userData && !data?.visitor) {
            data = JSON.parse(data.userData)
            this.user_Id = data;
            this.visitorData = null;
        } else {
            console.log('User Data:', data);
            // data = JSON.parse(data)
            this.visitorData.visitor = data?.visitor;
            this.visitorData.user_id = data.visitor;
        }
    }
    ngOnInit() {
        this.isLoading = true;
        this.route.params.subscribe((params: any) => {
            this.tshirtId = params['userId'];
        });
        if (!this.visitorData) this.getCoins();
        this.getTee();
    }


    changeSize(string: string) {
        this.activeSizeBtn = string;
    }

    getTee() {
        let data = {
            _id: this.tshirtId,
        };
        this.appservice.getOnetee(data).subscribe((result) => {
            if (result && result.data != null) {
                this.data = result.data;
                this.user_Id = this.visitorData ? this.visitorData.visitor : this.user_Id._id != this.data.userId ? this.data.user_Name : 'CreateeFi';
                this.discountedPrice = this.data.sellingPrice;
                this.changeTshirtColor();
                this.isActive = this.data.isActive;
                if (!this.isActive) this.cloudflareSharp = environment.cloudflareRaw
                this.isLoading = false;
            } else {
                this.router.navigate(['']);
            }
        });
    }

    openModal() {
        this.data.coupon = this.couponData.couponAvailable ? this.couponData.coupon_id : '';
        this.data.discountedPrice = this.discountedPrice
        this.data.originalPrice = this.data.sellingPrice;
        this.data.size = this.activeSizeBtn;
        this.data.coinsUsed = this.isChecked;
        this.data.visitorData = this.visitorData ? this.visitorData : null;
        this.data.createdById = this.data.userId;
        this.data.createdByName = this.data.user_Name;
        console.log('Data to be sent to modal:', this.data);
        this.modalDialog = this.matDialog.open(OrderStepperComponent, {
            width: '510px',
            height: '495px',
            data: this.data,
        });

        this.modalDialog.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
            if (result == 'withdraw') {
            }
        });
    }

    showImage() {
        let imageSrc: string = '../../assets/createefi/size_chart.jpg';
        window.open(imageSrc, '_blank');
    }

    openRefferalModal() {
        this.modalDialogforReferral = this.matDialog.open(ReferralPageComponent, {
            width: 'auto',
            height: 'auto',
        });

        this.modalDialogforReferral.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
            if (result == 'withdraw') {
            }
        });
    }

    openSingup() {
        const newTab = window.open(`${environment.frontend}`, '_blank');
        if (!newTab) {
            console.error('Failed to open a new tab. Please check if popups are blocked.');
        }
    }

    openCouponModal() {
        this.openCouponInput = !this.openCouponInput;
        this.enteredCouponInput = '';
        this.couponData = [];
    }

    onKeyUp(event: any) {
        this.couponData = [];
        this.enteredCouponInput = event.target.value;
    }

    checkCoupon(forCoupon: any = true) {
        if (!forCoupon && !this.isChecked) {
            this.discountedPrice = this.data?.sellingPrice - 100;
            this.showContent = false;
            return;
        }
        if (!forCoupon && this.isChecked) {
            this.showContent = true;
            return;
        }
        let data = {
            text: this.enteredCouponInput,
            using: 'text',
        };
        this.appservice.getCoupon(data).subscribe((response) => {
            if (
                response.status &&
                response.data &&
                response.data.length > 0 &&
                response.data[0].isActive
            ) {
                this.couponData = {
                    coupon_id: response.data[0]._id,
                    code: response.data[0].code,
                    discountValue: response.data[0].discountValue,
                    coupon_text: 'Coupon Applied ✅',
                    couponAvailable: true,
                };
                this.showContent = false;
                if (response.data[0].discountType === 'PERCENT') {
                    this.discountedPrice =
                        this.data?.sellingPrice -
                        (this.data?.sellingPrice * this.couponData.discountValue) / 100;
                    if (!Number.isInteger(this.discountedPrice)) {
                        this.discountedPrice =
                            this.discountedPrice % 1 >= 0.5
                                ? Math.ceil(this.discountedPrice)
                                : Math.floor(this.discountedPrice);
                    }
                } else {
                    this.discountedPrice = this.data?.sellingPrice - this.couponData.discountValue;
                }
                console.log('Discounted Price:', this.discountedPrice);
            } else {
                this.couponData = {
                    coupon_text: 'Coupon Not Available ❌',
                    couponAvailable: false,
                };
                this.showContent = true;
            }
        });
    }

    removeCoupon() {
        this.couponData = [];
        this.showContent = true;
        this.discountedPrice = '';
    }

    changeTshirtColor() {
        let img;
        if (this.data.frontImageUrl != "" || this.data.backImageUrl == "") {
            img = this.imageFrontUrls.find(img => img.key === this.data.itemColor);
            this.data.currentSide = img?.value;
            this.data.currentPrint = this.data.frontImageUrl;
        } else {
            img = this.imageBackUrls.find(img => img.key === this.data.itemColor);
            this.data.currentSide = img?.value;
            this.data.currentPrint = this.data.backImageUrl;
            this.currentSide = 'back';
        }
    }

    changeSide() {
        let img;
        if (this.currentSide == 'back') {
            this.currentSide = 'front';
            img = this.imageFrontUrls.find(img => img.key === this.data.itemColor);
            this.data.currentSide = img?.value;
            this.data.currentPrint = this.data.frontImageUrl;
        } else {
            this.currentSide = 'back';
            img = this.imageBackUrls.find(img => img.key === this.data.itemColor);
            this.data.currentSide = img?.value;
            this.data.currentPrint = this.data.backImageUrl;
        }
    }

    getCoins() {
        this.appservice.getCoins({ userName: this.user_Id.user_Name }).subscribe((response) => {
            if (response.status && response.data) {
                this.coins = response.data;
            }
        });
    }
}
