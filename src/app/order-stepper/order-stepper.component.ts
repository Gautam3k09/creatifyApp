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
    OrderPlacedComponent
  ],
  providers: [WindowRefService,AppServiceService],
  templateUrl: './order-stepper.component.html',
  styleUrl: './order-stepper.component.css'
})
export class OrderStepperComponent {
  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  dialogConfig = new MatDialogConfig();
  @Input() data: any;
  userData: any;
  userCoins: any = 50;
  userQuantity: any = 2;
  finalPrice:any;
  modalDialog: MatDialogRef<OrderPlacedComponent, any> | undefined;

  constructor(private fb: FormBuilder,private winRef : WindowRefService,private appservice: AppServiceService,public matDialog: MatDialog,@Inject(MAT_DIALOG_DATA) public buyPageData: {teeName_Name: any,teeName_Price:any,user_Id:any}){

  }

  ngOnInit() {
    this.userData  = localStorage.getItem('userId');
    if(this.userData){
      this.userData = JSON.parse(this.userData);
    }
    this.firstFormGroup = this.fb.group({
      building: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.building : '' ],
      area: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.area : ''],
      landmark: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.landmark : ''],
      city: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.city : ''],
      pincode: [this.userData?.user_Address[0] ? this.userData?.user_Address[0]?.pincode : '',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]],
    });
    this.secondFormGroup = this.fb.group({
      secondCtrl: ['', Validators.required],
    });
    this.calculatePrice();
  }

  calculatePrice(){
    this.finalPrice = (this.buyPageData.teeName_Price * this.userQuantity) - this.userCoins
  }

  createRazorPayOrder () {
    const options:any = {
      amount: 500,
      currency: 'INR',
      receipt: 'order_123456780',
    };
    this.appservice.createOrder(options).subscribe((result)=> {
      console.log(result,'result');
      const order_id = result.offer_id;
      this.payWithRazor(order_id);
    })
  }

  payWithRazor(order_id: any) {
    const options: any = {
      key: 'rzp_test_RbOpZbmihpoCFb',
      amount:500 * 100, // amount should be in paisa
      currency: 'INR',
      name: 'Creatify',
      description: 'Test Transaction',
      order_id: order_id,
      image: 'assets/blue-purple.jpg',
      modal:{
        escape:false
      },
      
      prefill: {
        name: 'Monti',
        email: 'monti@example.com',
        contact: '9511830363',
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
      if(response.razorpay_payment_id){

        this.openModal('paid');
      }
      // After successful payment, make a request to your server to verify the transaction
    };
    options.modal.ondismiss = ()=>{
      console.log('payment cancelled');
      // Handle the cancellation of the payment
    }
    const rzp = this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  openModal(string:any){
    let data = {
      from : string,
      buyPageData:this.buyPageData,
      userData:this.userData
    }
    this.modalDialog = this.matDialog.open(OrderPlacedComponent,  {
      width: '50vw',
      height: '45vh',
      data: data,
      disableClose: true
    });

    this.modalDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

}
