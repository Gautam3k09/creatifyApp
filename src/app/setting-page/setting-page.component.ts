import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting-page',
  standalone: true,
  imports: [HeaderPageComponent,ReactiveFormsModule,CommonModule],
  templateUrl: './setting-page.component.html',
  styleUrl: './setting-page.component.css'
})
export class SettingPageComponent {
  myForm!: FormGroup;
  userData: any;
  formEdit:any = true;
  saveBtn:any = 'edit';
  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit() {
    let userData : any = (localStorage.getItem('userId'));
    userData = JSON.parse(userData);
    console.log(userData);
    this.myForm = this.fb.group({
      name: [{value: userData.user_Name, disabled: this.formEdit}, Validators.required],
      number: [{value: userData.user_Number, disabled: this.formEdit}, [Validators.required]],
      address: [{value: 'asd', disabled: this.formEdit}, [Validators.required, Validators.minLength(15)]],
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
}
