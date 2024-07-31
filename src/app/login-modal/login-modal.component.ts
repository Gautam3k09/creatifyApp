import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  myLoginForm!: FormGroup;
  mySignupForm!: FormGroup;
  mobileNumber: any;
  mobileNumberVerified: boolean = false;
  sendOtp :any = '';

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>,private fb: FormBuilder,private router: Router) { }
  ngOnInit() {
    this.mySignupForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.valid); // true or false
    console.log('Email', form.value.username);
    console.log('Address', form.value.password);
  }
  onkeyUp(data:any){
    this.mobileNumber = data.target.value;
    console.log(this.mobileNumber);
  }

  closeModal() {
    this.dialogRef.close();
  }

  login() {
    localStorage.setItem('Login', 'true');
    this.router.navigate(['']);
  }

  verify(){
    this.sendOtp = true
  }
}
