import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WindowRefService } from '../window-ref.service';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { OrderStepperComponent } from '../order-stepper/order-stepper.component';
import { ReferralPageComponent } from '../referral-page/referral-page.component';

@Component({
  selector: 'app-buy-page',
  standalone: true,
  imports: [CommonModule,HeaderPageComponent,ReactiveFormsModule,OrderStepperComponent,ReferralPageComponent],
  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css',
  providers: [WindowRefService,AppServiceService],
})
export class BuyPageComponent implements OnInit  {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  globalCanvas : any;
  globalctx: any;
  imageSideFront :any = true;
  tshirtId: any;
  data : any;
  dialogConfig = new MatDialogConfig();
  activeColorBtn : any = 'white';
  activeSizeBtn : any = 'S';
  openCouponInput : any = false;
  enteredCouponInput : any = '';
  couponData : any = [];
  discountedPrice : any = '';
  modalDialog: MatDialogRef<OrderStepperComponent, any> | undefined;
  modalDialogforReferral: MatDialogRef<ReferralPageComponent,any> | undefined;
  constructor(public bsModalRef: BsModalRef,private winRef : WindowRefService,private appservice: AppServiceService,private route: ActivatedRoute,private router: Router,public matDialog: MatDialog) {
    
  }
  ngOnInit() {
    this.route.params.subscribe((params:any) => {
      this.tshirtId = params['userId'];
    });
    this.globalCanvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.globalctx= this.globalCanvas.getContext("2d");
    this.getTee();
  }

  changeColor(string: string) {
    console.log(string,'string')
    this.activeColorBtn = string;
  }

  changeSize(string: string) {
    this.activeSizeBtn = string;
  }
  
  getTee(){
    let data = {
      _id :  this.tshirtId ,
    }
    this.appservice.getOnetee(data).subscribe((result) => {
      if(result && result.data != null){
        this.data = result.data;
        this.loadimage()
      } else {
        this.router.navigate(['']);
      }
    })
  }

  loadimage() {
    this.globalctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const img = new Image();
    const boxWidth : number = this.globalCanvas.width;
    const boxHeight : number = this.globalCanvas.height;
    let newWidth, newHeight;
    if (1 > boxWidth / boxHeight) { // Image is wider
      newWidth = boxWidth;
      newHeight = boxWidth / 1;
    } else { // Image is taller or square
      newHeight = boxHeight;
      newWidth = boxHeight * 1;
    }
    img.src = this.imageSideFront ? this.data?.teeName_frontsideImg: this.data?.teeName_backsideImg;
    img.onload = () => {
      this.globalctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
  }
  
  changeSide(){
    let canvasStyle = document.querySelector('canvas') as any;
    if(this.imageSideFront) {
      canvasStyle.classList.remove('canvasFront');
      canvasStyle.classList.add('canvasBack');
      this.imageSideFront = false;
    } else {
      canvasStyle.classList.remove('canvasBack');
      canvasStyle.classList.add('canvasFront');
      this.imageSideFront = true;
    }
    this.loadimage()
  }

  createRazorPayOrder () {
    const options:any = {
      amount: this.data.teeName_Price,
      currency: 'INR',
      receipt: 'order_123456780',
    };
    this.appservice.createOrder(options).subscribe((result)=> {
      const order_id = result.offer_id;
      this.payWithRazor(order_id);
    })
  }

  payWithRazor(order_id: any) {
    const options: any = {
      key: 'rzp_test_RbOpZbmihpoCFb',
      amount: this.data.teeName_Price * 100, // amount should be in paisa
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
        teeName: this.data?.teeName_Name,
      },
      theme: {
        color: '#3399cc',
      },
    };
    options.handler = (response:any) => {
      console.log(response,'response');
      // After successful payment, make a request to your server to verify the transaction
    };
    options.modal.ondismiss = ()=>{
      console.log('payment cancelled');
      // Handle the cancellation of the payment
    }
    const rzp = this.winRef.nativeWindow.Razorpay(options);
    rzp.open();
  }

  openModal(){
    this.data.teeName_Price = this.couponData.couponAvailable == 0 ? this.data.teeName_Price : this.discountedPrice;
    this.data.size = this.activeSizeBtn;
    this.modalDialog = this.matDialog.open(OrderStepperComponent,  {
      width: '510px',
      height: '475px',
      // overflow: 'auto',
      data: this.data
    });

    this.modalDialog.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result == 'withdraw'){
        // let upiData = {
        //   id: this.userData._id,
        //   question: this.upiId,
        //   from: 'withdraw'
        // } 
        // this.postQuestionApi(upiData);
      }
    });
  }

  showImage(){
    let imageSrc: string = '../../assets/sizeChart.jpg';
    window.open(imageSrc, '_blank');
    // document.body.appendChild(image);
  }

  openRefferalModal(){
    this.modalDialogforReferral = this.matDialog.open(ReferralPageComponent,  {
      width: '500px',
      height: '300px',
      // overflow: 'auto',
      // data: this.data
    });

    this.modalDialogforReferral.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result == 'withdraw'){
      }
    });
  }

  openCouponModal(){
    this.openCouponInput = !this.openCouponInput;
    this.enteredCouponInput = '' ;
    this.couponData = [];
  }
  
  onKeyUp(event: any) { 
    this.couponData = [];
    this.enteredCouponInput = event.target.value;
  }
  
  checkCoupon() {
    let data ={
      text : this.enteredCouponInput,
      using : 'text'
    }
    this.appservice.getCoupon(data).subscribe((response) => {
      if(response.status && response.data && response.data.length > 0) {
        this.couponData = {
          coupon_Name: response.data[0].coupon_Name,
          coupon_Off: response.data[0].coupon_Off,
          coupon_text: 'Coupon Applied',
          couponAvailable : true
        };
        this.discountedPrice =this.data?.teeName_Price -  (this.data?.teeName_Price * this.couponData.coupon_Off) / 100;
      } else{
        this.couponData = {
          coupon_text: 'Coupon Not Available',
          couponAvailable : false
        };
      }
    });
  }
}
