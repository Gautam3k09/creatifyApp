import { Component, Inject, inject, Input } from '@angular/core';
import { FormBuilder, FormsModule, Validators,ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatStepperModule} from '@angular/material/stepper';
import {MatButtonModule} from '@angular/material/button';
import { WindowRefService } from '../window-ref.service';
import { AppServiceService } from '../app-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { OrderPlacedComponent } from '../order-placed/order-placed.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { localStorageService } from '../local-storage-service';

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
    MatIconModule
  ],
  providers: [WindowRefService],
  templateUrl: './order-stepper.component.html',
  styleUrl: './order-stepper.component.css'
})
export class OrderStepperComponent {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  dialogConfig = new MatDialogConfig();
  @Input() data: any;
  userData: any;
  userQuantity: any = 1;
  finalPrice:any;
  modalDialog: MatDialogRef<OrderPlacedComponent, any> | undefined;
  numberVerified = true;
  verifyLabel:any = 'Verify & Proceed';
  storedData: any;

  constructor(private fb: FormBuilder,private winRef : WindowRefService,private appservice: AppServiceService,public matDialog: MatDialog,@Inject(MAT_DIALOG_DATA) public buyPageData: {teeName_Name: any,price:any,user_Id:any,_id:any,quantity:any,size:any,coinsUsed:any,coupon:any},public dialogRef: MatDialogRef<OrderStepperComponent>,public localStorage:localStorageService){

    this.storedData = this.localStorage.getUserLocalStorage();
    if(this.storedData && this.storedData.LoggedIn != null){
      this.userData = JSON.parse(this.storedData.userData);
    }
        
    this.firstFormGroup = this.fb.group({
      building: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.building : '' ],
      area: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.area : ''],
      landmark: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.landmark : ''],
      city: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.city : ''],
      pincode: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.pincode : '',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    });
    this.secondFormGroup = this.fb.group({
      phoneNumber: ['',[Validators.required,Validators.minLength(10), Validators.maxLength(10), ]],
      otp1: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp2: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp3: ['', [Validators.required, Validators.pattern('[0-9]')] ],
      otp4: ['', [Validators.required, Validators.pattern('[0-9]')] ],
    });
  }

  ngOnInit() {
    this.calculatePrice();
  }

  calculatePrice(){
    this.finalPrice = (this.buyPageData?.price * this.userQuantity)
  }

  createRazorPayOrder () {
    const options:any = {
      amount: this.buyPageData?.price * 100,
      currency: 'INR',
      // receipt: 'order_123456780',
    };
    this.appservice.createOrder(options).subscribe((result)=> {
      const order_id = result.id;
      this.payWithRazor(order_id);
    })
  }

  payWithRazor(order_id: any) {
    const options: any = {
      key: 'rzp_test_TbWyYgkbb7t7xX',
      amount: this.buyPageData?.price * 100, // amount should be in paisa
      currency: 'INR',
      name: 'Creatify',
      description: 'Test Transaction',
      order_id: order_id,
      image: 'assets/blue-purple.jpg',
      modal:{
        escape:false
      },
      
      prefill: {
        name: this.userData.user_Name,
        email: 'monti@example.com',
        // contact: '9511830363',
      },
      notes: {
        teeName: 'this.data.teeName_Name',
      },
      theme: {
        color: '#3399cc',
      },
    };
    options.handler = (response:any) => {
      console.log(response,'response');
      this.verifyOrder(response);
      // if(response.razorpay_payment_id){
        // this.placeOrder();   
        // setTimeout(() => {          
        // }, 1000);
      // }
    };
    options.modal.ondismiss = ()=>{
      console.log('payment cancelled');
      // Handle the cancellation of the payment
    }
    const rzp = this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  openModal(string:any,rpData:any=''){
    this.buyPageData.quantity = this.userQuantity;
    let data = {
      from : string,
      buyPageData:this.buyPageData,
      userData: this.storedData.LoggedIn != null ? this.userData : this.secondFormGroup.value,
      finalPrice:this.finalPrice,
      address: this.firstFormGroup.value,
      rpData : rpData
    }
    let width = window.innerWidth;
    this.dialogConfig = {
      data: data,
      disableClose: true
    }
    if(width > 600) {
      this.dialogConfig.width = "50vw";
      this.dialogConfig.height = "45vh";
    } else {
      this.dialogConfig.width = "85%";
      this.dialogConfig.height = "65vh";
    }
    this.modalDialog = this.matDialog.open(OrderPlacedComponent,this.dialogConfig);

    this.modalDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result != 'back'){
        this.closeModal();
      }
    });
  }

  closeModal(){
    this.dialogRef.close();
  }

  placeOrder(){
    let data = {
      tshirtId : this.buyPageData._id,
      by: this.storedData.LoggedIn != null ? this.userData.user_Name : this.secondFormGroup.value.phoneNumber,
      madeBy: this.buyPageData.user_Id,
      address: this.firstFormGroup.value,
      paymentMethod : 'ONLINE',
      tshirtPrice : this.buyPageData.price,
      // quantity : this.userQuantity,
      size : this.buyPageData.size,
      coinsUsed : this.buyPageData.coinsUsed,
      finalPrice : this.finalPrice,
      coupon : this.buyPageData.coupon,
    }
    this.appservice.postOrder(data).subscribe((result)=> {
      if(result.status && result.data){
        const orderId = result.data;
        this.openModal('paid');
      }
    })
  }

  verifyOrder(data:any){
    this.appservice.verify(data).subscribe((result)=> {
      if(result.paid){
        this.openModal('paid',data);
      }
    }) 
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

  onkeyUp(data:any){

  }

  verify(){
    this.numberVerified = true;
    this.verifyLabel = 'proceed'
    this.secondFormGroup.disable();
  }

  clearForm(){
    this.secondFormGroup.reset();
    this.numberVerified = false;
    this.verifyLabel = 'Verify & Proceed'
    this.secondFormGroup.enable();
  }

}
