import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { WindowRefService } from '../window-ref.service';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  activeColorBtn : any = 'white';
  activeSizeBtn : any = 'S';
  openCouponInput : any = false;
  enteredCouponInput : any = '';
  couponData : any = [];
  discountedPrice : any = '';
  modalDialog: MatDialogRef<OrderStepperComponent, any> | undefined;
  modalDialogforReferral: MatDialogRef<ReferralPageComponent,any> | undefined;
  @ViewChild('mainCanvas', { static: false })
  canvasRef_for_Bg!: ElementRef<HTMLCanvasElement>;
  currentMainCanvas : any;
  public MainCanvasctx: any;
  imageFrontSrc = 'assets/display-tees/front-black.png';
  imageBackSrc = 'assets/display-tees/back-black.png';
  imageFrontUrls = [ 
    {key : 'Onyx black', value : 'assets/display-tees/front-black.png'},
    {key : 'Pearl white', value : 'assets/display-tees/front-white.png'},
    {key : 'Sapphire blue', value : 'assets/display-tees/front-blue.png'},
    {key : 'Ruby maroon', value : 'assets/display-tees/front-maroon.png'},    
  ];
  imageBackUrls = [
    {key : 'Onyx black', value : 'assets/display-tees/back-black.png'},
    {key : 'Pearl white', value : 'assets/display-tees/back-white.png'},
    {key : 'Sapphire blue', value : 'assets/display-tees/back-blue.png'},
    {key : 'Ruby maroon', value : 'assets/display-tees/back-maroon.png'},
  ];

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

  ngAfterViewInit() {
    this.drawImageOnCanvas(this.imageFrontSrc);
  }

  drawImageOnCanvas(image:any): void {
    const canvas = this.canvasRef_for_Bg?.nativeElement;
    let cavn= document.getElementById('mainTeeData') as HTMLCanvasElement;
    const ctx : any= cavn.getContext('2d');

    canvas.width = 175; // You can adjust the width
    canvas.height = 150; // You can adjust the height
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0,canvas.width, canvas.height);
    };    
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
        this.changeTshirtColor();
        this.loadimage(true);
        this.drawImageOnCanvas(this.imageFrontSrc);
      } else {
        this.router.navigate(['']);
      }
    })
  }

  loadimage(firstTime : boolean = false) {
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
    if(!this.data?.tee_frontsideImg && firstTime) {
      this.changeSide(true)
    }
    img.src = this.imageSideFront ? this.data?.tee_frontsideImg: this.data?.tee_backsideImg;
    img.onload = () => {
      this.globalctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
  }
  
  changeSide(firstTime : boolean = false) {
    let canvasStyle = document.querySelector('#canvas') as any;
    if(this.imageSideFront) {
      canvasStyle.classList.remove('canvasFront');
      canvasStyle.classList.add('canvasBack');
      this.drawImageOnCanvas(this.imageBackSrc);
      this.imageSideFront = false;
    } else {
      canvasStyle.classList.remove('canvasBack');
      canvasStyle.classList.add('canvasFront');
      this.drawImageOnCanvas(this.imageFrontSrc);
      this.imageSideFront = true;
    }
    if(!firstTime) {
      this.loadimage();
    }
  }

  createRazorPayOrder () {
    const options:any = {
      amount: this.data.tee_Price,
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
      amount: this.data.tee_Price * 100, // amount should be in paisa
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
    this.data.tee_Price = this.couponData.couponAvailable == 0 ? this.data.tee_Price : this.discountedPrice;
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
        this.discountedPrice =this.data?.tee_Price -  (this.data?.tee_Price * this.couponData.coupon_Off) / 100;
      } else{
        this.couponData = {
          coupon_text: 'Coupon Not Available',
          couponAvailable : false
        };
      }
    });
  }
  changeTshirtColor () {
    if(this.data){
      this.imageFrontUrls.find((imageData: any) => {
        if(imageData.key == this.data.tee_Color){
          console.log(imageData)
          this.imageFrontSrc = imageData.value
        }
      });
      this.imageBackUrls.find((imageData: any) => {
        if(imageData.key == this.data.tee_Color){
          this.imageBackSrc = imageData.value
        }
      });
    }
  }
}
