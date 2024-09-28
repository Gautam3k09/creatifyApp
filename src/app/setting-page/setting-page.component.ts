import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";
import { AppServiceService } from '../app-service.service';
import { MatDialogConfig, MatDialogRef,MatDialog } from '@angular/material/dialog';
import { ConfirmationBoxComponent } from '../confirmation-box/confirmation-box.component';
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [HeaderPageComponent,ReactiveFormsModule,CommonModule,FormsModule,NgxUiLoaderModule,ConfirmationBoxComponent],
  // providers: [AppServiceService],
  templateUrl: './setting-page.component.html',
  styleUrl: './setting-page.component.css'
})
export class SettingPageComponent {
  myForm!: FormGroup;
  userData: any = '';
  formEdit:any = true;
  saveBtn:any = 'edit';
  activeTab : string = 'profile';
  merchAccount:string = 'Normal';
  couponOff : number = 5;
  couponName: string = '';
  couponAvailable : boolean = false;
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<ConfirmationBoxComponent, any> | undefined;
  queryQuetions: any = '';
  upiId:string ='';
  storedData:any;

  constructor(private appservice : AppServiceService,private fb: FormBuilder,private router: Router,private ngxLoader: NgxUiLoaderService,public matDialog: MatDialog,public localStorage : localStorageService) {
    this.storedData = this.localStorage.getUserLocalStorage();
    if(this.storedData ){
      this.userData = JSON.parse(this.storedData.userData);
    }
  }

  ngOnInit() {
    this.ngxLoader.start();
    this.ngxLoader.stop();
    this.merchAccount = this.userData.user_Role;
    this.myForm = this.fb.group({
      building: [this.userData.user_Address[0] ? this.userData.user_Address[0].building : '' ],
      area: [this.userData.user_Address[0] ? this.userData.user_Address[0].area : ''],
      landmark: [this.userData.user_Address[0] ? this.userData.user_Address[0].landmark : ''],
      city: [this.userData.user_Address[0] ? this.userData.user_Address[0].city : ''],
      pincode: [this.userData.user_Address[0] ? this.userData.user_Address[0].pincode : '',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    }); 
  }
 

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Name', form.value.name);
    console.log('Email', form.value.email);
    console.log('Address', form.value.address);
  }

  
  edit(flag:any) {
    console.log(flag);  // edit or save
    if(flag == 'edit'){
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
  
  updateLocalStorage(){
    this.appservice.postUserCheck({data:this.userData.user_Number}).subscribe((response) => {
      let localData : any = {
        LoggedIn : true,
        userData : JSON.stringify(response.data[0])
      };
      localData = JSON.stringify(localData)
      this.localStorage.setUserLocalStorage(localData);
    })
    
  }
  AddOrUpdateAddress() { 
    this.ngxLoader.start();
    let data = {
      area : this.myForm.value.area,
      building : this.myForm.value.building,
      city :  this.myForm.value.city,
      landmark :  this.myForm.value.landmark,
      pincode :  this.myForm.value.pincode,
      name: this.userData.user_Name,
    }
    this.appservice.addUpdateAdress(data).subscribe((response) => {
      if(response && response.status) {
        window.localStorage.removeItem('userId');
        this.updateLocalStorage()
        this.ngxLoader.stop();
      } else {
        console.log('Address not updated');
      }
    });
  }
  
  changeTab(tab: string) {
    this.activeTab = tab;
    if(this.activeTab == 'merch') {
      this.appservice.getCoupon({data:this.userData._id}).subscribe((response) => {
        if(response.status && response.data && response.data.length > 0) {
          this.couponName = response.data[0].coupon_Name;
          this.couponOff = response.data[0].coupon_Off;
          this.couponAvailable = true;
        } else{
          this.couponAvailable = false;
        }
      })
    }
  }
  
  updateMerch(){
    this.appservice.updateRole({name: this.userData.user_Name}).subscribe((response) => {
      if(response.status){
        this.merchAccount = 'Merch'
        this.updateLocalStorage();
      }
    });
  }
  
  addCoupon(){
    let data = {
      name : this.couponName,
      off: this.couponOff,
      _id : this.userData._id
    };
    this.appservice.createCoupon(data).subscribe((response) => {
      if(response.status){
        this.couponAvailable = true;
      }
    });
  }
  
  removeCoupon(){
    this.appservice.deleteCoupon({id : this.userData._id}).subscribe((response) => {
      if(response.status){
        console.log('Coupon added or updated successfully');
        this.couponName = '';
        this.couponOff = 5;
        this.couponAvailable = false;
      } else{
        console.log('Coupon not removed');
      }
    });
  }
  
  openModal(data:any){
    this.modalDialog = this.matDialog.open(ConfirmationBoxComponent,  {
      width: '350px',
      height: '200px',
      data: data
    });

    this.modalDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result == 'withdraw'){
        let upiData = {
          id: this.userData._id,
          question: this.upiId,
          from: 'withdraw'
        } 
        this.postQuestionApi(upiData);
      }
    });
  }
    
  withdraw() {
    let data :any = {
      title: 'Confirmation',
      message: 'Are you sure you want to ' + '35$' + ' withdraw?',
      for : 'withdraw',
      input: {
        id: this.userData._id,
        question: this.upiId,
        from: 'withdraw'
      }
    } 
    this.openModal(data);
  }
  onKeyUp(event: any) { 
    this.queryQuetions = event.target.value;
  }

  postQuestionApi(data:any){
    this.appservice.postQuestion(data).subscribe((response) => {
      if(response){
        if(data.from == 'withdraw'){
          this.upiId = '';
        } else {
          console.log('Question posted successfully');
          let textarea : any = document.getElementById('textarea');
          if(textarea){
            textarea.value = '';
          } 
          this.queryQuetions = ''
        }
      } else{

      }
    });
  }

  postQuestion(){
    let data = {
      id: this.userData._id,
      question: this.queryQuetions,
      from: 'questions'
    }
    this.postQuestionApi(data);
  }
  
  logout(){
    let data :any = {
      title: 'Confirmation',
      message: 'Are you sure you want to Logout',
      for : 'logout'
    };
    this.openModal(data);
  }


}
  