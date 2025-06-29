import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { localStorageService } from '../../local-storage-service';
import { AppServiceService } from '../../app-service.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { DebounceUtil } from '../../login-modal/debounce.utils';

@Component({
  selector: 'app-login-via-google',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-via-google.component.html',
  styleUrl: './login-via-google.component.css'
})
export class LoginViaGoogleComponent {
  currentStep: number = 1; // Track the current step of the login process
  stepTwoForm: FormGroup;
  referralAvailable: boolean = true;
  usernameAvailable: boolean = false;
  email: any;

  constructor(
    private dialogRef: MatDialogRef<LoginViaGoogleComponent>,
    private localStorage: localStorageService,
    private appservice: AppServiceService,
    private fb: FormBuilder
  ) {
    this.stepTwoForm = this.fb.group({
      name: ['', {
        validators: [Validators.required, Validators.minLength(4), Validators.maxLength(16)],
      }],
      referredBy: ['']
    });
  }

  signInWithGoogle(): void {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        this.email = user.email;
        this.appservice.postUserCheck({ data: result.user.email }).subscribe((response) => {
          if (!response.status) {
            this.currentStep = 2; // Move to step two if user is not found
          } else {
            response.data[0].LoggedIn = true;
            delete response.data[0].createdAt;
            delete response.data[0].updatedAt;
            delete response.data[0].user_Mobile;
            delete response.data[0].__v;
            this.localStorage.setUserLocalStorage(response.data[0]);
            location.reload();
          }
        });
        return;
      })
      .catch((error) => {
        this.currentStep = 1;
        alert("Login failed. Please try again.");
      });
  }

  onSubmit() {
    this.createUser();
  }

  get name() {
    return this.stepTwoForm.get('name');
  }

  onkeyUpName = DebounceUtil.debounce('onkeyUpName', (data: any) =>
    this.processOnKeyUpName(data)
  );

  processOnKeyUpName(data: any) {
    data = {
      userName: this.stepTwoForm.value.name,
    };

    if (
      this.stepTwoForm.value.name.length >= 4 &&
      this.stepTwoForm.value.name.length <= 12
    ) {
      this.appservice.checkUserName(data).subscribe(
        (response) => {
          if (response.status) {
            this.usernameAvailable = false
            this.stepTwoForm.controls['name'].setErrors({
              usernameAlreadyExist: true,
            });
          } else {
            this.usernameAvailable = true
            this.stepTwoForm.controls['name'].setErrors(null);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  processVerifyReferral() {
    if (this.stepTwoForm.value.referredBy.length > 0) this.referralAvailable = false;

    if (
      this.stepTwoForm.value.referredBy.length >= 4 &&
      this.stepTwoForm.value.referredBy.length <= 12
    ) {
      this.appservice.checkUserName({ userName: this.stepTwoForm.value.referredBy }).subscribe(
        (response: any) => {
          if (response.status) {
            this.stepTwoForm.controls['referredBy'].setErrors({
              referralCode: false,
            });
            this.stepTwoForm.controls['referredBy'].setErrors(null);
            this.referralAvailable = true;
          } else {
            this.stepTwoForm.controls['referredBy'].setErrors({
              referralCode: true,
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  createUser() {
    const data = {
      Email: this.email,
      username: this.stepTwoForm.value.name,
      referral: this.stepTwoForm.value.referredBy || '',
    };
    this.appservice.postUserDataForRegister(data).subscribe(
      (response) => {
        let localData: any = {
          LoggedIn: true,
          userData: JSON.stringify(response.data),
        };
        localData = JSON.stringify(localData);
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

  closeDialog(): void {
    this.dialogRef.close();
  }
}