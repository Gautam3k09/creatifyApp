import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [HeaderPageComponent,ReactiveFormsModule,CommonModule,NgxUiLoaderModule],
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
  constructor(private appservice : AppServiceService,private fb: FormBuilder,private router: Router,private ngxLoader: NgxUiLoaderService) {}

  ngOnInit() {
    this.ngxLoader.start();
    let userData : any = (localStorage.getItem('userId'));
    this.userData = JSON.parse(userData);
    this.ngxLoader.stop();
    // this.merchAccount = this.userData
    console.log(this.userData,'here')
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

  logout(){
    localStorage.removeItem("Login");
    this.router.navigate(['']);
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
        this.appservice.postUserCheck({data:this.userData.user_Number}).subscribe((response) => {
          localStorage.setItem('userId',JSON.stringify(response.data[0]));
          let userData : any = (localStorage.getItem('userId'));
          this.userData = JSON.parse(userData);
          this.ngxLoader.stop();
        })
      } else {
        console.log('Address not updated');
      }
    });
  }

  changeTab(tab: string) {
    this.activeTab = tab;
  }

  updateMerch(){
    this.appservice.updateRole({name: this.userData.user_Name}).subscribe((response) => {
      if(response.status){
        this.merchAccount = 'Merch'
      }
    });
  }
}
