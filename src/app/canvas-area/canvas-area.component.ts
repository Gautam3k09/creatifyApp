import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { localStorageService } from '../local-storage-service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { SaveTeeModalComponent } from '../save-tee-modal/save-tee-modal.component';

@Component({
  selector: 'app-canvas-area',
  standalone: true,
  imports: [FormsModule,CommonModule,HeaderPageComponent,ReactiveFormsModule],
  providers:[AppServiceService],
  templateUrl: './canvas-area.component.html',
  styleUrl: './canvas-area.component.css'
})
export class CanvasAreaComponent implements AfterViewInit{
  teeDetailForm!: FormGroup;
  @ViewChild('mainCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageInput') fileInput: any;

  public ctx:any;
  public MainCanvasctx!: CanvasRenderingContext2D;
  public selectedColor: any = 'black';
  
  globalCanvas: any = '';
  
  image: any = '';
  imageFrontGlobalStore:any = '';
  imageBackGlobalStore:any = '';
  imageFrontGlobalTarget:any = '';
  imageBackGlobalTarget:any = '';
  // for positioning
  imagestartXaxis: any = 50;
  imagestartYaxis: any = 50;
  frontImageOffsetX: any = 0;
  frontImageOffsetY: any = 0;
  backImageOffsetX: any = 0;
  backImageOffsetY: any = 0;
  imageOffsetX = 0; 
  imageOffsetY = 0;
  // for size in inches
  frontHeightInches : any = 0;
  frontWidthInches : any = 0;
  backHeightInches : any = 0;
  backWidthInches : any = 0;

  imageWidth : any = 100;// Initial width
  imageHeight : any = 150; // Initial height
  
  frontImageWidth : any = 100;
  frontImageHeight : any = 150;
  backImageWidth : any = 100;
  backImageHeight : any = 150;
  // for moving
  isDragging = false;
  isGrabbing: boolean = false;
  public isImgUploaded : boolean = false;
  isPatternApplied: boolean = false;
  // for ..
  base64DataFrontSide : any = '';
  base64DataBackSide : any = '';
  imageUrl : any = '';  
  designName : any = "";
  teeSize : any = 'S';
  priceRange : any = 649;
  rotationAngle = 0;
  // for sides
  shirtSideFront: boolean = true;
  shirtPreferencesPersonal: boolean = true;
  canvasWidthFront : any = 209;
  canvasHeightFront : any = 270;
  canvasWidthBack : any = 230;
  canvasHeightBack : any = 312;
  // for mobile side
  canvasHeightBackMob : any = 236;
  canvasWidthBackMob : any = 173;
  canvasWidthFrontMob : any = 202;
  canvasHeightFrontMob : any = 157;
  currentSide : any = 'front';
  storedData : any;

  // for tee color
  imageFrontSrc = 'assets/tshirts/black-f.png';
  imageFrontUrls = [
    'assets/tshirts/black-f.png',
    'assets/tshirts/white-f.png',
    'assets/tshirts/blue-f.png',
    'assets/tshirts/maroon-f.png',
  ];
  imageBackSrc = 'assets/tshirts/black-b.png';
  imageBackUrls = [
    'assets/tshirts/black-b.png',
    'assets/tshirts/white-b.png',
    'assets/tshirts/blue-b.png',
    'assets/tshirts/maroon-b.png',
  ];
  imageColor : any = 'Onyx black';

  gloableimage :any;
  frontImageName : any = '';
  backImageName : any = '';
  frontImgFormdata : FormData = new FormData();
  backImgFormdata : FormData = new FormData();
  userData : any;

  //for mobile
  isMobile : boolean = false;
  
  modalDialog: MatDialogRef<SaveTeeModalComponent, any> | undefined;
  dialogConfig = new MatDialogConfig();

  constructor(private router: Router,private fb: FormBuilder, private appservice:AppServiceService,public localStorage : localStorageService,public matDialog: MatDialog) {
    this.storedData = this.localStorage.getUserLocalStorage();
    this.isMobile = window.innerWidth > 500 ? false : true;
    // }
    if (window.innerWidth > 450 && window.innerWidth <= 1024) {
      alert('Tablet view is not supported. Please use a mobile or desktop.');
      this.router.navigate(['/tees']);
    } else if (window.innerWidth <= 350 || window.innerHeight <= 600) {
      alert('Your device does not meet the minimum height requirement.');
      this.router.navigate(['/tees']);
    } else {
      // ✅ Allowed: Desktop or Mobile (Width > 350px & Height > 700px)
      console.log('Allowed');
    }
  }
  ngOnInit() {
    this.userData = this.storedData.userData;
    this.userData = JSON.parse(this.userData);
    console.log(this.userData.user_Role);
    this.priceRange = this.userData?.user_Role == 'Merch' ? 549 : 649;
    //declared canvas globally for common front and back rendering
    this.globalCanvas = this.canvas.nativeElement as HTMLCanvasElement;
    //Added listener for image move
    this.canvas.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.nativeElement.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.canvas.nativeElement.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.nativeElement.addEventListener('touchmove', this.handleTouchMove.bind(this));

    this.teeDetailForm = this.fb.group({
      teeName : ['', [Validators.required]],
      price   : [this.priceRange, [Validators.required]],
    });
    this.toggleShirtSide('front',true);
  }

  //  ngafterViewInit should not be removed may be used later 
  ngAfterViewInit(): void {
    const mainCanvas = this.canvasRef.nativeElement;
    const secondaryCanvas = this.canvas.nativeElement;
    mainCanvas.width = 450;
    mainCanvas.height = 350;
    if(this.isMobile) {
      secondaryCanvas.width = this.canvasWidthFrontMob;
      secondaryCanvas.height = this.canvasHeightFrontMob;
    } else {
      secondaryCanvas.width = this.canvasWidthFront;
      secondaryCanvas.height = this.canvasHeightFront;
    }
    this.MainCanvasctx = mainCanvas.getContext('2d')!;
    this.ctx = secondaryCanvas.getContext('2d')!;
    this.drawImageOnCanvas(this.imageFrontSrc);
  }

  drawImageOnCanvas(image : any): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Set canvas size
      canvas.width = 450; // You can adjust the width
      canvas.height = 450; // You can adjust the height

      const img = new Image();
      img.src = image;

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.onerror = () => {
        console.error('Failed to load the image.');
      };
    } else {
      console.error('Canvas context not found!');
    }
  }

  handleFileChange(event: any,from = '') {
    if(this.isMobile) {
      this.imageWidth = 100;
      this.imageHeight = 80;
    } else {
      this.imageWidth = 100;
      this.imageHeight = 150;
    }
    if(from == 'changeShirtSide'){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image.onload = () => {
          this.updateImage(); 
        };
        this.image.src = e.target.result;
        if(this.shirtSideFront) {
          this.base64DataFrontSide = this.image.src;
        } else {
          this.base64DataBackSide = this.image.src;
        }
        this.isImgUploaded = true;
      };
      let targetfile = this.shirtSideFront ? this.imageFrontGlobalTarget : this.imageBackGlobalTarget;
      reader.readAsDataURL(targetfile);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        if(this.shirtSideFront) {
          this.frontImgFormdata = new FormData();
          this.frontImageName = Date.now() +  "_" + event.target.files[0].name;
          this.imageFrontGlobalStore = img;
          this.imageFrontGlobalTarget = event.target.files[0];
          this.frontImgFormdata.append('image', this.imageFrontGlobalTarget,this.frontImageName );
        } else {
          this.backImgFormdata = new FormData();
          this.backImageName =  Date.now() + "_" + event.target.files[0].name;
          this.imageBackGlobalStore = img;
          this.imageBackGlobalTarget = event.target.files[0];
          this.backImgFormdata.append('image', this.imageBackGlobalTarget,this.backImageName );
        };
        this.updateImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);    
    this.isImgUploaded = true;
    setTimeout(() => {
      if(this.shirtSideFront) {
        this.base64DataFrontSide = this.globalCanvas.toDataURL('image/png',0.95);
      } else {
        this.base64DataBackSide = this.globalCanvas.toDataURL('image/png',0.95);
      }
    }, 1000);
  }

  updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    
    const newX = Math.max(0, Math.min(canvasWidth - this.imageWidth, this.imageOffsetX));
    const newY = Math.max(0, Math.min(canvasHeight - this.imageHeight, this.imageOffsetY));
    // console.log(this.imageWidth,this.imageHeight,canvasHeight,canvasWidth)
    //image update
    if(this.image != '') {
      this.ctx.drawImage(this.image, newX, newY, this.imageWidth, this.imageHeight);
    }

    if(this.shirtSideFront) {
      this.frontImageWidth = this.imageWidth;
      this.frontImageHeight = this.imageHeight;
      this.calculateInches('front')
    } else {
      this.backImageWidth = this.imageWidth;
      this.backImageHeight = this.imageHeight;
      this.calculateInches('back')
    }
    this.updateImageBase64(this.shirtSideFront)
  }

  handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.imagestartXaxis = event.offsetX;
    this.imagestartYaxis = event.offsetY;
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging && this.isImgUploaded) {
      const deltaX = event.offsetX - this.imagestartXaxis;
      const deltaY = event.offsetY - this.imagestartYaxis;
      this.imagestartXaxis = event.offsetX;
      this.imagestartYaxis = event.offsetY;

      // Update offset values considering canvas boundaries
      this.updateImagePosition(deltaX, deltaY);
    }
  }
  
  // Touch Event Handlers
  handleTouchStart(event: TouchEvent) {
    event.preventDefault(); // Prevents scrolling while dragging
    this.isDragging = true;

    const touch = event.touches[0];
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    this.imagestartXaxis = touch.clientX - rect.left;
    this.imagestartYaxis = touch.clientY - rect.top;
  }

  handleTouchMove(event: TouchEvent) {
    if (!this.isDragging || !this.isImgUploaded) return;
    event.preventDefault(); // Prevents scrolling while dragging

    const touch = event.touches[0];
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;
    const deltaX = touchX - this.imagestartXaxis;
    const deltaY = touchY - this.imagestartYaxis;

    this.imagestartXaxis = touchX;
    this.imagestartYaxis = touchY;

    this.updateImagePosition(deltaX, deltaY);
  }

  handleTouchEnd() {
    this.isDragging = false;
  }

  // Utility function for updating image position
  updateImagePosition(deltaX: number, deltaY: number) {
    this.imageOffsetX = Math.max(0, Math.min(this.imageOffsetX + deltaX, this.canvas.nativeElement.width - this.imageWidth));
    this.imageOffsetY = Math.max(0, Math.min(this.imageOffsetY + deltaY, this.canvas.nativeElement.height - this.imageHeight));

    if (this.shirtSideFront) {
      this.frontImageOffsetX = this.imageOffsetX;
      this.frontImageOffsetY = this.imageOffsetY;
    } else {
      this.backImageOffsetX = this.imageOffsetX;
      this.backImageOffsetY = this.imageOffsetY;
    }

    this.updateImage();
  }
  onKeyUp(event: any) { 
    this.designName = event.target.value;
  }
  
  toggleShirtSide (string:any,operation:any=false) {
    let frontRadio : any = document.querySelectorAll('#frontLabel');
    let backRadio : any = document.querySelectorAll('#backLabel');
    if(string == 'front') {
      this.shirtSideFront = true;
      frontRadio.forEach((item:any) => {
        item.style.color = 'white';
        item.style.backgroundColor = 'black';
      })
      backRadio.forEach((item:any) => {
        item.style.color = 'black';
        item.style.backgroundColor = 'transparent';
      })
    }
    if(string == 'back'){
       this.shirtSideFront = false;
       backRadio.forEach((item:any) => {
        item.style.color = 'white';
        item.style.backgroundColor = 'black';
      })
      frontRadio.forEach((item:any) => {
        item.style.color = 'black';
        item.style.backgroundColor = 'transparent';
      })
    }
    if (!operation) {
      this.updateBorder();
    }
  }
  
  updateBorder() {
    //add border
    if(this.shirtSideFront){
      this.currentSide = 'front';
      this.isImgUploaded = false;
      if(this.imageFrontGlobalStore != '') {
        this.image = this.imageFrontGlobalStore;
        this.handleFileChange(event,'changeShirtSide');
        this.base64DataFrontSide = this.globalCanvas.toDataURL('image/png',0.95);
        this.updateImageBase64(true);
        this.isImgUploaded = true;
      }
      this.drawImageOnCanvas(this.imageFrontSrc);
      let canvasStyle = document.querySelector('.canvas') as any;
      if(!this.isMobile ) {
        canvasStyle.style.marginTop  = 77 + 'px';
        canvasStyle.style.marginLeft = 120 + 'px';
        this.globalCanvas.height = this.canvasHeightFront;
        this.globalCanvas.width = this.canvasWidthFront;
      } else {
        canvasStyle.style.marginTop = 118 + 'px';
        canvasStyle.style.marginLeft = 102 + 'px';
        canvasStyle.style.width = 155 + 'px';
        canvasStyle.style.height = 202 + 'px';
        this.globalCanvas.height = this.canvasHeightFrontMob;
        this.globalCanvas.width = this.canvasWidthFrontMob;
      }
      this.imageOffsetX = this.frontImageOffsetX;
      this.imageOffsetY = this.frontImageOffsetY;
      this.imageWidth = this.frontImageWidth;
      this.imageHeight = this.frontImageHeight;
    } else {
      this.currentSide = 'back';
      this.isImgUploaded = false;
      if(this.imageBackGlobalStore != '' ) {
        this.image = this.imageBackGlobalStore;
        this.handleFileChange(event,'changeShirtSide');
        this.updateImageBase64(false);
        this.isImgUploaded = true;
        this.base64DataBackSide = this.globalCanvas.toDataURL('image/png',0.95);
      } 
      this.drawImageOnCanvas(this.imageBackSrc);
      let canvasStyle = document.querySelector('.canvas') as any;
      if(!this.isMobile ) {
        canvasStyle.style.marginTop  = 88 + 'px';
        canvasStyle.style.marginLeft = 108 + 'px';
        this.globalCanvas.height = this.canvasHeightBack;
        this.globalCanvas.width = this.canvasWidthBack;
      } else {
        canvasStyle.style.marginTop = 127 + 'px';
        canvasStyle.style.marginLeft = 94 + 'px';
        canvasStyle.style.width = 172 + 'px';
        canvasStyle.style.height = 235 + 'px';
        this.globalCanvas.height = this.canvasHeightBackMob;
        this.globalCanvas.width = this.canvasWidthBackMob;
      }
      this.imageOffsetX = this.backImageOffsetX;
      this.imageOffsetY = this.backImageOffsetY;
      this.imageWidth = this.backImageWidth;
      this.imageHeight = this.backImageHeight;
    }
  }
  
  clearFiles() {
    this.image = '';
    this.isImgUploaded = false;
    this.updateImage()
    this.imageOffsetX = 0; 
    this.imageOffsetY = 0;
    this.imageWidth = 100; 
    this.imageHeight = 150;
    if(this.shirtSideFront) {
      this.imageFrontGlobalStore = '';
      this.frontImageOffsetX;
      this.frontImageOffsetY;
      this.frontImgFormdata = new FormData();
      this.frontHeightInches = 0;
      this.frontWidthInches = 0;
      this.base64DataFrontSide = '';
    } else {
      this.imageBackGlobalStore = '';      
      this.backImageOffsetX;
      this.backImageOffsetY;
      this.backImgFormdata = new FormData();
      this.backHeightInches = 0;
      this.backWidthInches  = 0;
      this.base64DataBackSide = '';
    }
  }
  
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.value); // true or false
  }

  updateImageBase64(side:any){
    side ? this.base64DataFrontSide= this.globalCanvas.toDataURL('image/png',0.95): this.base64DataBackSide = this.globalCanvas.toDataURL('image/png',0.95)
  }

  uploadFile(side:any) {
    let image = side == 'front' ? this.frontImgFormdata : this.backImgFormdata;
    this.appservice.postImageToS3(image).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.log(error);
      }
    );
  }
  
  uploadImage() : any{
    const data = {
        userId :  this.userData.user_Name,
        price : this.priceRange,
        teeName : this.designName,
        frontBase64 :  this.base64DataFrontSide,
        backbase64 : this.base64DataBackSide,
        role : this.userData.user_Role,
        frontUrl : this.imageFrontGlobalStore != '' ? this.frontImageName : '' ,
        backUrl : this.imageBackGlobalStore != '' ? this.backImageName : '',
        teeColor : this.imageColor,
        frontHeightInches : this.frontHeightInches,
        frontWidthInches : this.frontWidthInches,
        backHeightInches : this.backHeightInches,
        backWidthInches : this.backWidthInches,
    }
    console.log(data);
    if(this.frontImgFormdata) {
      this.uploadFile('front');
    }
    if (this.backImgFormdata) {
      this.uploadFile('back');
    }
    this.appservice.postImage(data).subscribe(
      (response) => {
        this.router.navigate(['/tees']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  changeImage(index:any) {    this.imageFrontSrc = this.imageFrontUrls[index];
    this.imageBackSrc = this.imageBackUrls[index];
    if (this.currentSide == 'front') {
      this.drawImageOnCanvas(this.imageFrontSrc);
    } else {
      this.drawImageOnCanvas(this.imageBackSrc);
    }
    switch (index) {
      case 0:
          this.imageColor = 'Onyx black';
          break;
      case 1:
          this.imageColor = 'Pearl white';
          break;
      case 2:
          this.imageColor = 'Sapphire blue';
          break;
      case 3:
          this.imageColor = 'Ruby maroon';
          break;
    }
  }
  
  validateHeight(event: any, isWidth: boolean, maxValue: number): void {
    const input : any = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    let value = input.value.trim() === '' ? NaN : parseInt(input.value, 10);
    if (isNaN(value)) {
        return; // Allow empty input temporarily
    }
    if (value < 1) {
        value = 1;
    } else if (value > maxValue) {
        value = maxValue;
    }
    input.value = value.toString();
    if (isWidth) {
        this.imageWidth = value;
    } else {
        this.imageHeight = value;
    }
    this.updateImage();
  }

  openModal(fromHelper:any = false){
    let width : any ;
    if(window.innerWidth > 600) {
      width = "30%";
    } else {
      width = "80%";
    }
    let data = {
      isMerch : this.userData.user_Role,
      finalPrice : this.priceRange,
      teeName : this.teeDetailForm.value.teeName,
      fromHelper : fromHelper
    }
    this.modalDialog = this.matDialog.open(SaveTeeModalComponent,{
      width: width,
      height: 'auto',
      data: data,
    });

    this.modalDialog.afterClosed().subscribe((result : any) => {
      console.log('The dialog was closed', result);
      if(result) {
        this.uploadImage();
      }
    });
  }

  calculateInches(side:any) {
    let heightppi : any;
    let widthppi : any;
    if(this.isMobile) {
      if(side == 'front') {
        heightppi = 11.21;
        widthppi = 18.36;
      } else {
        heightppi = 14.69;
        widthppi = 14.33;
      }
    } else {
      if(side == 'front') {
        heightppi = 19.29;
        widthppi = 19;
      } else {
        heightppi = 19.5;
        widthppi = 19.16;
      }
    }
    if(this.isMobile) {
      if(side == 'front') {        
        this.frontHeightInches = (this.frontImageHeight / heightppi).toFixed(2);
        this.frontWidthInches = (this.frontImageWidth / widthppi).toFixed(2);
      } else {
        this.backHeightInches = (this.backImageHeight / heightppi).toFixed(2);
        this.backWidthInches = (this.backImageWidth / widthppi).toFixed(2);
      }
    } else {
      if(side == 'front') {        
        this.frontHeightInches = (this.frontImageHeight / heightppi).toFixed(2);
        this.frontWidthInches = (this.frontImageWidth / widthppi).toFixed(2);
      } else {
        this.backHeightInches = (this.backImageHeight / heightppi).toFixed(2);
        this.backWidthInches = (this.backImageWidth / widthppi).toFixed(2);
      }
    }
    // console.log(this.frontHeightInches,this.frontWidthInches,this.backHeightInches,this.backWidthInches)
  }
  
  ngOnDestroy() {
    this.canvas.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.nativeElement.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
  }
}