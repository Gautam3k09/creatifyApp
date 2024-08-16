import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule,MatDialogTitle],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  
  myLoginForm!: FormGroup;
  mySignupForm!: FormGroup;
  mobileNumber: any ='';
  registerNumber: any='';
  mobileNumberVerified: boolean = false;
  sendOtp :any = false;
  sendOtpForRegister: boolean = false;
  public newData:any;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>,private fb: FormBuilder,private router: Router,@Inject(MAT_DIALOG_DATA) public data: any) {
    this.myLoginForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')] ]
    });
    this.mySignupForm = this.fb.group({
      rOtp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp4: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      userName : ['',[Validators.required,Validators.minLength(4), Validators.maxLength(12)]]
    });

    setTimeout(() => {
      
      this.newData = this.data?.isEdit;
      console.log(this.data)
    }, 1000);
   }
  ngOnInit() {
  }

  onSubmit(form: FormGroup) {

  }
  onkeyUp(data:any,login:any){
    if(login) this.mobileNumber = data.target.value;
    if(!login) this.registerNumber = data.target.value;
  }

  closeModal() {
    this.dialogRef.close();
  }

  login() {
    localStorage.setItem('Login', 'true');
    location.reload();
  }

  verify(login:any){
    if(login) this.sendOtp = true;
    if (!login) this.sendOtpForRegister = true;
  }
  
  // get otpControls() {
  //   return this.myLoginForm.controls;
  // }

  moveToNextInput(event: any) {
    console.log(event.target,'move')
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

  moveToNextInputReg(event:any){
    console.log('here')
    const currentInput = event.target as HTMLInputElement;
    const nextInputId = currentInput.id.replace(/(\d+)/, (match, group1) => {
      const nextIndex = event.key=='Backspace' ?  parseInt(group1, 10) - 1 : parseInt(group1, 10) + 1;
      return nextIndex.toString();
    });
    const nextInput = document.getElementById(nextInputId) as HTMLInputElement;
    if (nextInput) {
      nextInput.focus();
    }
  }


}
