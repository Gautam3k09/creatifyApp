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
  mobileNumber: any ='';
  mobileNumberVerified: boolean = false;
  sendOtp :any = false;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>,private fb: FormBuilder,private router: Router) {
    this.myLoginForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')] ]
    });
   }
  ngOnInit() {
    this.mySignupForm = this.fb.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(form: FormGroup) {

  }
  onkeyUp(data:any){
    this.mobileNumber = data.target.value;
  }

  closeModal() {
    this.dialogRef.close();
  }

  login() {
    localStorage.setItem('Login', 'true');
    location.reload();
  }

  verify(){
    this.sendOtp = true
  }
  
  get otpControls() {
    return this.myLoginForm.controls;
  }
  moveToNextInput(event: any) {
    const currentInput = event.target as HTMLInputElement;
    const nextInputId = currentInput.id.replace(/(\d+)/, (match, group1) => {
      const nextIndex = event.key=='Backspace' ?  parseInt(group1, 10) - 1 : parseInt(group1, 10) + 1;
      return nextIndex.toString();
    });
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
    if(this.myLoginForm.value.otp1 != '' && this.myLoginForm.value.otp2 != '' && this.myLoginForm.value.otp3 != '' && this.myLoginForm.value.otp4 != '') this.mobileNumberVerified = true
  }

}
