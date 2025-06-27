import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { localStorageService } from '../local-storage-service';
import { LoaderComponent } from '../loader/loader.component';
import moment from 'moment-timezone';

@Component({
    selector: 'app-setting-page',
    standalone: true,
    imports: [HeaderPageComponent, ReactiveFormsModule, CommonModule, FormsModule, LoaderComponent],
    templateUrl: './setting-page.component.html',
    styleUrl: './setting-page.component.css',
})
export class SettingPageComponent {
    myForm!: FormGroup;
    userData: any = '';
    formEdit: any = true;
    saveBtn: any = 'edit';
    activeTab: string = 'profile';
    merchAccount: string = 'Normal';
    couponOff: any = 5;
    couponName: string = '';
    couponAvailable: boolean = false;
    dialogConfig = new MatDialogConfig();
    modalDialog: MatDialogRef<ConfirmationBoxComponent, any> | undefined;
    queryQuetions: any = '';
    upiId: string = '';
    storedData: any;
    orderData: any = [];
    isLoading = false;

    constructor(
        private appservice: AppServiceService,
        private fb: FormBuilder,
        private router: Router,
        public matDialog: MatDialog,
        public localStorage: localStorageService
    ) {
        this.storedData = this.localStorage.getUserLocalStorage();
        if (this.storedData) {
            this.userData = JSON.parse(this.storedData.userData);
        }
    }

    ngOnInit() {
        this.isLoading = true;
        this.getUserData();
        this.isLoading = false;
        this.myForm = this.fb.group({
            building: [this.userData.user_Address[0] ? this.userData.user_Address[0].building : ''],
            area: [this.userData.user_Address[0] ? this.userData.user_Address[0].area : ''],
            landmark: [this.userData.user_Address[0] ? this.userData.user_Address[0].landmark : ''],
            city: [
                {
                    value: this.userData.user_Address[0] ? this.userData.user_Address[0].city : '',
                    disabled: true,
                },
            ],
            pincode: [
                this.userData.user_Address[0] ? this.userData.user_Address[0].pincode : '',
                [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
            ],
        });
        this.fetchAddress()
    }

    getUserData() {
        this.appservice.postUserCheck({ data: this.userData.user_Email }).subscribe((response) => {
            if (response && response.status) {
                this.userData = response.data[0];
                this.merchAccount = this.userData.user_Role;
            }
        });
    }

    onSubmit(form: FormGroup) {
        console.log('Valid?', form.valid); // true or false
        console.log('Name', form.value.name);
        console.log('Email', form.value.email);
        console.log('Address', form.value.address);
    }

    edit(flag: any) {
        console.log(flag); // edit or save
        if (flag == 'edit') {
            this.formEdit = false;
            this.saveBtn = 'save';
            this.myForm.controls['name'].enable();
            this.myForm.controls['address'].enable();
        } else {
            this.saveBtn = 'edit';
            this.formEdit = true;
            this.myForm.controls['address'].disable();
            this.myForm.controls['name'].disable();
        }
    }

    updateLocalStorage() {
        this.appservice.postUserCheck({ data: this.userData.user_Email }).subscribe((response) => {
            let localData: any = {
                LoggedIn: true,
                userData: JSON.stringify(response.data[0]),
            };
            localData = JSON.stringify(localData);
            this.localStorage.setUserLocalStorage(localData);
        });
    }

    AddOrUpdateAddress() {
        this.isLoading = true;
        let data = {
            area: this.myForm.value.area,
            building: this.myForm.value.building,
            city: this.myForm.value.city,
            landmark: this.myForm.value.landmark,
            pincode: this.myForm.value.pincode,
            name: this.userData.user_Name,
        };
        this.appservice.addUpdateAdress(data).subscribe((response) => {
            if (response && response.status) {
                window.localStorage.removeItem('userId');
                this.updateLocalStorage();
                this.isLoading = false;
            } else {
                console.log('Address not updated');
            }
        });
    }

    changeTab(tab: string) {
        if (this.activeTab == tab) return
        this.activeTab = tab;
        if (this.activeTab == 'merch') {
            let data = {
                using: 'Id',
                userId: this.userData._id,
            };
            this.appservice.getCoupon(data).subscribe((response) => {
                if (
                    response.status &&
                    response.data &&
                    response.data.length > 0 &&
                    response.data[0].isActive
                ) {
                    this.couponName = response.data[0].code;
                    this.couponOff = response.data[0].discountValue;
                    this.couponAvailable = true;
                } else {
                    this.couponAvailable = false;
                }
            });
        }
        if (this.activeTab == 'order') {
            let data = {
                customerId: this.userData._id,
            };
            this.appservice.getOrder(data).subscribe((response) => {
                if (response.data && response.data.length > 0) {
                    console.log(response.data, 'here')
                    this.orderData = response.data;
                    this.convertTime();
                } else {
                    this.orderData = [];
                }
            });
        }
    }

    updateMerch() {
        this.appservice.updateRole({ name: this.userData.user_Name }).subscribe((response) => {
            if (response.status) {
                this.merchAccount = 'Merch';
                this.updateLocalStorage();
            }
        });
    }

    addCoupon() {
        alert(
            'Discounted amount will be split in a 60:40 ratio, where you cover 60%, and Createefi covers 40%.'
        );
        let data = {
            code: this.couponName,
            discountValue: this.couponOff,
            createdBy: this.userData._id,
            assignedToUser: null,
            isActive: true,
            discountType: "percent",
            usageLimit: 0
        };

        this.appservice.createCoupon(data).subscribe({
            next: (response) => {
                if (response.status) {
                    this.couponAvailable = true;
                } else {
                    window.alert('Failed to create coupon. Please try again.');
                }
            },
            error: (err) => {
                console.error(err);
                window.alert('An error occurred while creating the coupon.');
            }
        });
    }

    removeCoupon() {
        this.appservice.deleteCoupon({ id: this.userData._id }).subscribe((response) => {
            if (response.status) {
                console.log('Coupon added or updated successfully');
                this.couponName = '';
                this.couponOff = 5;
                this.couponAvailable = false;
            } else {
                console.log('Coupon not removed');
            }
        });
    }

    openModal(data: any) {
        this.modalDialog = this.matDialog.open(ConfirmationBoxComponent, {
            width: '350px',
            height: 'auto',
            data: data,
        });

        this.modalDialog.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
            if (result == 'withdraw') {
                let upiData = {
                    id: this.userData._id,
                    question: this.upiId,
                    from: 'withdraw',
                };
                this.postQuestionApi(upiData);
            }
        });
    }

    withdraw() {
        let data: any = {
            title: 'Confirmation',
            message: 'Are you sure you want to ' + '35$' + ' withdraw?',
            for: 'withdraw',
            input: {
                id: this.userData._id,
                question: this.upiId,
                from: 'withdraw',
            },
        };
        this.openModal(data);
    }
    onKeyUp(event: any) {
        this.queryQuetions = event.target.value;
    }

    postQuestionApi(data: any) {
        this.appservice.postQuestion(data).subscribe((response) => {
            if (response) {
                if (data.from == 'withdraw') {
                    this.upiId = '';
                } else {
                    console.log('Question posted successfully');
                    let textarea: any = document.getElementById('textarea');
                    if (textarea) {
                        textarea.value = '';
                    }
                    this.queryQuetions = '';
                    window.alert('Raised successfully');
                }
            } else {
            }
        });
    }

    postQuestion() {
        let data = {
            id: this.userData._id,
            email: this.userData.user_Email,
            question: this.queryQuetions,
            from: 'questions',
        };
        this.postQuestionApi(data);
    }

    logout() {
        let data: any = {
            title: 'Confirmation',
            message: 'Are you sure you want to Logout',
            for: 'logout',
        };
        this.openModal(data);
    }

    convertTime() {
        this.orderData.forEach((element: any) => {
            element.createdAt = moment(element.createdAt).tz('Asia/Kolkata').format('DD MMMM YYYY');
            if (element.tee_from == element.customer) {
                element.tee_from = 'You';
            }
        });
    }

    fetchAddress() {
        const pincode = this.myForm.get('pincode')?.value;
        const pincodeLength = pincode ? pincode.toString().length : 0;
        if (pincodeLength == 6) {
            this.appservice.getAddressByPincode(pincode.toString()).subscribe(
                (data) => {
                    if (data[0]?.Status === 'Success') {
                        this.myForm.controls['city'].setValue(data[0].PostOffice[0].State);
                    } else {
                        this.myForm.controls['city'].setValue('');
                        window.alert('Invalid Pincode');
                    }
                },
                (error) => {
                    console.error('Error fetching address:', error);
                    this.myForm.controls['city'].setValue('');
                }
            );
            // this.appservice.getPincode({ pincode: pincode }).subscribe(
            //     (data) => {
            //         let availabilty = this.checkavl(data);
            //         console.log('Availability:', availabilty);
            //     },
            //     (error) => {
            //         console.error('Error fetching address:', error);
            //         this.myForm.controls['city'].setValue('');
            //     }
            // );
        }
    }

    checkavl(filtered: any) {
        const hasBothY = filtered.some((item: any) => item.cod === 'Y' && item.prepaid === 'Y');
        if (hasBothY) return "available";

        const hasPrepaidY = filtered.some((item: any) => item.prepaid === 'Y');
        if (hasPrepaidY) return "online-available";

        return "not available";
    }

    navigateBuyPage(id: any) {
        this.router.navigate(['/buy/' + id]);
    }
}
