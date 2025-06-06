import { Component, Inject, Input, NgZone } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    Validators,
    ReactiveFormsModule,
    FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { WindowRefService } from '../window-ref.service';
import { AppServiceService } from '../app-service.service';
import {
    MAT_DIALOG_DATA,
    MatDialog,
    MatDialogConfig,
    MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { localStorageService } from '../local-storage-service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-order-stepper',
    standalone: true,
    imports: [
        MatButtonModule,
        MatStepperModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        CommonModule,
        MatIconModule,
    ],
    providers: [WindowRefService],
    templateUrl: './order-stepper.component.html',
    styleUrl: './order-stepper.component.css',
})
export class OrderStepperComponent {
    firstFormGroup!: FormGroup;
    secondFormGroup!: FormGroup;
    thirdFormGroup!: FormGroup;
    dialogConfig = new MatDialogConfig();
    @Input() data: any;
    userData: any;
    userQuantity: any = 1;
    finalPrice: any;
    numberVerified = true;
    verifyLabel: any = 'Verify & Proceed';
    storedData: any;
    pincode: any;
    state: any = false;
    emailOtpSent: boolean = false;
    btnLoader: boolean = false;


    //for another modal
    showOrderPlacedModal = false;
    orderId: any;
    fromCod: boolean = false;
    isLoading = false;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private winRef: WindowRefService,
        private appservice: AppServiceService,
        public matDialog: MatDialog,
        private ngZone: NgZone,
        @Inject(MAT_DIALOG_DATA)
        public buyPageData: {
            createdById: any;
            createdByName: any;
            designName: any;
            discountedPrice: any;
            originalPrice: any;
            user_Id: any;
            _id: any;
            quantity: any;
            size: any;
            coinsUsed: any;
            coupon: any;
            itemColor: any;
            visitorData: any;
        },
        public dialogRef: MatDialogRef<OrderStepperComponent>,
        public localStorage: localStorageService
    ) {
        if (!this.buyPageData.visitorData) {
            this.storedData = this.localStorage.getUserLocalStorage();
            this.userData = JSON.parse(this.storedData.userData);
        }

        this.firstFormGroup = this.fb.group({
            building: [
                this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.building : '',
                Validators.required,
            ],
            area: [
                this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.area : '',
                Validators.required,
            ],
            landmark: [
                this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.landmark : '',
            ],
            city: [
                {
                    value: this.userData?.user_Address[0]
                        ? this.userData?.user_Address[0]?.city
                        : '',
                    disabled: true,
                },
                Validators.required,
            ],
            pincode: [
                this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.pincode : '',
                [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
            ],
        });
        this.secondFormGroup = this.fb.group({
            email: [
                '',
                [Validators.required, Validators.email],
            ],
            otp1: ['', [Validators.required, Validators.pattern('[0-9]')]],
            otp2: ['', [Validators.required, Validators.pattern('[0-9]')]],
            otp3: ['', [Validators.required, Validators.pattern('[0-9]')]],
            otp4: ['', [Validators.required, Validators.pattern('[0-9]')]],
        });
    }

    ngOnInit() {
        console.log('Buy Page Data:', this.buyPageData, this.buyPageData.visitorData);
        this.calculatePrice();
    }

    calculatePrice() {
        this.finalPrice = this.buyPageData?.discountedPrice * this.userQuantity;
    }

    createRazorPayOrder() {
        const options: any = {
            amount: this.buyPageData?.discountedPrice * 100,
            currency: 'INR',
            // receipt: 'order_123456780',
        };
        this.appservice.createOrder(options).subscribe((result) => {
            const order_id = result.id;
            this.payWithRazor(order_id);
        });
    }

    payWithRazor(order_id: any) {
        const options: any = {
            key: 'rzp_test_TbWyYgkbb7t7xX',
            amount: this.buyPageData?.discountedPrice * 100, // amount should be in paisa
            currency: 'INR',
            name: 'CREATEEFI',
            description: 'Test Transaction',
            order_id: order_id,
            // image: 'assets/blue-purple.jpg',
            modal: {
                escape: false,
            },

            prefill: {
                name: this.userData.user_Name,
                email: this.userData.email,
            },
            notes: {
                teeName: this.buyPageData.designName,
            },
            theme: {
                color: '#3399cc',
            },
        };
        options.handler = (response: any) => {
            this.verifyOrder(response).subscribe({
                next: (result: any) => {
                    if (result.paid) {
                        this.ngZone.run(() => {
                            this.isLoading = true;
                            this.openOrderPlacedModal('paid'); // << inside Angular zone
                            this.placeOrder('ONLINE');
                        });
                    } else {
                        alert('Payment verification failed.');
                    }
                },
                error: (err) => {
                    alert('Could not verify payment. Please try again.');
                }
            });
        };
        options.modal.ondismiss = () => {
            console.log('payment cancelled');
            alert('payment cancelled');
            this.failedUrl();
        };
        const rzp = this.winRef.nativeWindow.Razorpay(options);
        rzp.open();
    }


    openOrderPlacedModal(from: 'cod' | 'paid') {
        this.fromCod = from === 'cod';
        this.finalPrice = this.fromCod ? parseFloat(this.buyPageData.discountedPrice) + 59 : this.buyPageData.discountedPrice;
        document.body.style.overflow = 'hidden';
        this.showOrderPlacedModal = true;
    }

    closeModal() {
        this.dialogRef.close();
    }

    placeOrder(method: string) {
        this.isLoading = true;
        let data = {
            customerId: !this.buyPageData.visitorData ? this.userData._id : null,
            email: this.buyPageData.visitorData ? this.secondFormGroup.value.email : null,
            sku: 'OVRS-' + this.buyPageData.size + '-' + this.buyPageData.itemColor,
            order_quantity: 1,
            tshirtId: this.buyPageData._id,
            tshirtName: this.buyPageData.designName,
            createdById: this.buyPageData.createdById,
            createdByName: this.buyPageData.createdByName,
            address: this.firstFormGroup.value,
            paymentMethod: method,
            finalPrice: this.finalPrice,
            subtotal: method == 'COD' ? this.buyPageData.originalPrice + 59 : this.buyPageData.originalPrice,
            coupon: { code: this.buyPageData.coinsUsed ? 'cCoinsUsed' : this.buyPageData.coupon },
            couponAmount: this.buyPageData.originalPrice - this.buyPageData.discountedPrice
        };
        this.appservice.postOrder(data).subscribe({
            next: (result) => {
                if (result.status && result.orderId) {
                    this.orderId = result.orderId;
                    this.fromCod = false;
                    this.isLoading = false;
                } else {
                    window.alert("Order could not be placed. Please try again.");
                    this.isLoading = false;
                }
            },
            error: (err) => {
                console.error("Order API Error:", err);
                window.alert("Something went wrong. Please try again later.");
                this.isLoading = false;
            }
        });
    }

    verifyOrder(data: any) {
        return this.appservice.verify(data);
    }

    moveToNextInputReg(event: any) {
        const currentInput = event.target as HTMLInputElement;
        const nextInputId = currentInput.id.replace(/(\d+)/, (match, group1) => {
            const nextIndex =
                event.key == 'Backspace' ? parseInt(group1, 10) - 1 : parseInt(group1, 10) + 1;
            return nextIndex.toString();
        });
        const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
        if (nextInput) {
            nextInput.focus();
        }
    }

    clearForm() {
        this.secondFormGroup.reset();
        this.numberVerified = false;
        this.verifyLabel = 'Verify & Proceed';
        this.secondFormGroup.enable();
    }

    fetchAddress() {
        if (this.pincode.toString().length == 6) {
            this.appservice.getAddressByPincode(this.pincode).subscribe(
                (data) => {
                    if (data[0]?.Status === 'Success') {
                        this.firstFormGroup.controls['city'].setValue(data[0].PostOffice[0].State);
                        this.state = true;
                    } else {
                        this.firstFormGroup.controls['city'].setValue('');
                        this.state = false;
                        window.alert('Invalid Pincode');
                    }
                },
                (error) => {
                    console.error('Error fetching address:', error);
                    this.state = false;
                    this.firstFormGroup.controls['city'].setValue('');
                }
            );
        }
    }

    redirectShop() {
        this.showOrderPlacedModal = false;
        this.closeModal()
        if (!this.buyPageData.visitorData) {
            this.router.navigate(['/shop']);
        } else {
            this.router.navigate(['/' + this.buyPageData.visitorData.visitor + '/merch/' + this.buyPageData.visitorData.user_id]);
        }
    }

    failedUrl() {
        window.location.reload();
    }

    sendEmailOtp() {
        this.btnLoader = true;
        const email = this.secondFormGroup.value.email;
        console.log(email, 'this.mobileEmail');

        this.appservice.sendOtp(email).subscribe({
            next: () => {
                this.btnLoader = false;
                this.emailOtpSent = true;
            },
            error: () => {
                this.btnLoader = false;
                window.alert('Failed to send OTP. Please check your email and try again.');
            }

        });
    }

    verifyOtp(stepper: any) {
        let userOtp =
            this.secondFormGroup.value.otp1 +
            this.secondFormGroup.value.otp2 +
            this.secondFormGroup.value.otp3 +
            this.secondFormGroup.value.otp4;
        this.appservice.verifyOtp(this.secondFormGroup.value.email, userOtp).subscribe({
            next: () => {
                stepper.next();
                this.numberVerified = true;
                this.verifyLabel = 'proceed';
                this.secondFormGroup.disable();
            },
            error: () => {
                window.alert('Otp is incorrect. Please try again.');
            },
        });
    }
}
