import { Component, HostListener, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppServiceService } from '../app-service.service';
import { localStorageService } from '../local-storage-service';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  providers: [AppServiceService],
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule,MatDialogTitle,MatInputModule,MatStepperModule,MatButtonModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {
  
  myLoginForm!: FormGroup;
  mySignupForm!: FormGroup;
  otpForm!: FormGroup;
  mobileNumber: any ='';
  registerNumber: any='';
  // mobileNumberVerified: boolean = false;g
  sendOtp :any = false;
  sendOtpForRegister: boolean = false;
  numberExists: any ;
  regNumberExists:any;
  otpPage: any = false;
  showWrongOtpError: boolean = false;
  showWrongOtpErrorForRegister: boolean = false;
  storeUserData :any;

  constructor(public dialogRef: MatDialogRef<LoginModalComponent>,private appservice : AppServiceService,private fb: FormBuilder,private router: Router,@Inject(MAT_DIALOG_DATA) public data: any,public localStorage: localStorageService) {
    this.myLoginForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      number:  ['',[Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]')]],
    });
    this.mySignupForm = this.fb.group({
      userName : ['',[Validators.required,Validators.minLength(4), Validators.maxLength(12)]],
      referral : ['',],
      number:  ['',[Validators.required,Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]')]],
    });

    this.otpForm = this.fb.group({
      rOtp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      rOtp4: ['', [Validators.required, Validators.pattern('[0-9]')] ],
    });
  }

  ngOnInit() {
  }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/\s/g, '');
  }

  onSubmit(form: FormGroup) {

  }

  onkeyUp(data:any,login:any){
    this.storeUserData = '';
    if(login){
      this.mobileNumber = data.target.value;
      this.sendOtp = false;
      this.myLoginForm.controls['number'].setErrors({
        "number": true
      });
      if(this.mobileNumber.length == 10 ) {
        this.verifyNumber(this.mobileNumber,login)
      }
    } 
    if(!login) {
      this.numberExists = false;
      this.registerNumber = data.target.value;
      this.mySignupForm.controls['number'].setErrors({
        "number": true
      });
      
      if(this.registerNumber.length == 10 ) {
        this.verifyNumber(this.registerNumber,login)
      }
    }
  }

  onkeyUpName(data:any){
    data = {
      userName: this.mySignupForm.value.userName
    };
    if(this.mySignupForm.value.userName.length >= 4 && this.mySignupForm.value.userName.length <= 12){
      this.appservice.checkUserName(data ).subscribe( (response) => {
          if(response.status){
              this.mySignupForm.controls['userName'].setErrors({
                "usernameAlreadyExist": true
              });
          } else {
            this.mySignupForm.controls['userName'].setErrors({
              "usernameAlreadyExist": false
            });
            this.mySignupForm.controls['userName'].setErrors(null);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  login(boolean:boolean) {
    let userOtp : any;
    if(boolean ){
      this.showWrongOtpError = false;
      userOtp = this.myLoginForm.value.otp1.toString() +this.myLoginForm.value.otp2.toString() +this.myLoginForm.value.otp3.toString() +this.myLoginForm.value.otp4.toString();
    } else{
      this.showWrongOtpErrorForRegister = false;
      userOtp = this.otpForm.value.rOtp1 + this.otpForm.value.rOtp2 + this.otpForm.value.rOtp3 + this.otpForm.value.rOtp4;
    }
    if(userOtp === '0000') {
      if(boolean){
        let localData : any = {
          LoggedIn : true,
          userData : JSON.stringify(this.storeUserData)
        }
        localData = JSON.stringify(localData)
        this.localStorage.setUserLocalStorage(localData);
        setTimeout(() => {
          location.reload();
        }, 500);
      } else {
        const data = {
          number : this.registerNumber,
          username : this.mySignupForm.value.userName,
          referral : this.mySignupForm.value.referral
        }
        this.appservice.postUserDataForRegister(data).subscribe(
          (response) => {
            let localData : any = {
              LoggedIn : true,
              userData : JSON.stringify(response.data)
            };
            localData = JSON.stringify(localData)
            this.localStorage.setUserLocalStorage(localData);
            setTimeout(() => {
              location.reload();
            }, 500);
          },
          (error) => {
            console.log(error);
          }
        );
      }
      
    }else{
      this.showWrongOtpError = true;
    }
   
  }

  Proceed(action:any){
    if (action === 'proceed') this.otpPage = true;
    if (action === 'back') this.otpPage = false;
  }

  verifyNumber(data:any,login:any){
    this.appservice.postUserCheck({data:data}).subscribe((response) => {
        if (!response.status && !login) {
          this.regNumberExists = false;
          this.mySignupForm.controls['number'].setErrors(null);
        } else if(response.status && !login) { 
          this.regNumberExists = true;
        } else if (!response.status && login) {
          this.numberExists = true;
        } else {
          this.myLoginForm.controls['number'].setErrors(null);
          this.numberExists = false;
          this.sendOtp = true;
          this.storeUserData = response.data[0];
        }
      },
      (error) => { console.log(error); }
    );
  }

  verifyReferral(event:any) {
    if(this.mySignupForm.value.referral.length >= 4 && this.mySignupForm.value.referral.length <= 12){
      this.appservice.checkUserName({userName:this.mySignupForm.value.referral} ).subscribe( (response) => {
          if(response.status){
              this.mySignupForm.controls['referral'].setErrors({
                "referralCode": false
              });
              this.mySignupForm.controls['referral'].setErrors(null);
          } else {
            this.mySignupForm.controls['referral'].setErrors({
              "referralCode": true
            });
            
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
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
  }

  moveToNextInputReg(event:any){
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

  otpCheck(){

  }


}
