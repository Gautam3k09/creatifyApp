import { AfterViewInit, Component, ElementRef, ViewChild,inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { localStorageService } from '../local-storage-service';

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
  // for size
  imageWidth = 100; // Initial width
  imageHeight = 150; // Initial height
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
  priceRange : any = 550;
  rotationAngle = 0;
  // for sides
  shirtSideFront: boolean = true;
  shirtPreferencesPersonal: boolean = true;
  canvasWidthFront : any = 205;
  canvasHeightFront : any = 268;
  canvasWidthBack : any = 230;
  canvasHeightBack : any = 310;
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

  constructor(private router: Router,private fb: FormBuilder, private appservice:AppServiceService,public localStorage : localStorageService) {
    this.storedData = this.localStorage.getUserLocalStorage();
  }
  ngOnInit() {
    this.userData = this.storedData.userData;
    this.userData = JSON.parse(this.userData);
    //declared canvas globally for common front and back rendering
    this.globalCanvas = this.canvas.nativeElement as HTMLCanvasElement;
    //Added listener for image move
    this.canvas.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));

    this.teeDetailForm = this.fb.group({
      teeName : ['', [Validators.required]],
      price   : ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  //  ngafterViewInit should not be removed may be used later 
  ngAfterViewInit(): void {
    const mainCanvas = this.canvasRef.nativeElement;
    const secondaryCanvas = this.canvas.nativeElement;
    mainCanvas.width = 450;
    mainCanvas.height = 350;
    secondaryCanvas.width = this.canvasWidthFront;
    secondaryCanvas.height = this.canvasHeightFront;
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
    this.imageWidth = 100;
    this.imageHeight = 150;
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
          this.frontImageName = event.target.files[0].name
          this.imageFrontGlobalStore = img;
          this.imageFrontGlobalTarget = event.target.files[0];
          this.frontImgFormdata.append('image', this.imageFrontGlobalTarget,this.frontImageName + "_" + Date.now());
        } else {
          this.backImgFormdata = new FormData();
          this.backImageName = event.target.files[0].name
          this.imageBackGlobalStore = img;
          this.imageBackGlobalTarget = event.target.files[0];
          this.backImgFormdata.append('image', this.imageBackGlobalTarget,this.backImageName + "_" + Date.now());
        };
        this.updateImage();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(event.target.files[0]);    
    this.isImgUploaded = true;
    setTimeout(() => {
      if(this.shirtSideFront) {
        this.base64DataFrontSide = this.globalCanvas.toDataURL('image/png');
      } else {
        this.base64DataBackSide = this.globalCanvas.toDataURL('image/png');
      }
    }, 1000);
  }

  updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    
    const newX = Math.max(0, Math.min(canvasWidth - this.imageWidth, this.imageOffsetX));
    const newY = Math.max(0, Math.min(canvasHeight - this.imageHeight, this.imageOffsetY));

    //image update
    if(this.image != '') {
      this.ctx.drawImage(this.image, newX, newY, this.imageWidth, this.imageHeight);
    }

    if(this.shirtSideFront) {
      this.frontImageWidth = this.imageWidth;
      this.frontImageHeight = this.imageHeight;
    } else {
      this.backImageWidth = this.imageWidth;
      this.backImageHeight = this.imageHeight;
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
      this.imageOffsetX = Math.max(0, Math.min(this.imageOffsetX + deltaX, this.canvas.nativeElement.width - this.imageWidth));
      this.imageOffsetY = Math.max(0, Math.min(this.imageOffsetY + deltaY, this.canvas.nativeElement.height - this.imageHeight));
      if(this.shirtSideFront) {
            this.frontImageOffsetX = this.imageOffsetX;
            this.frontImageOffsetY = this.imageOffsetY;
          } else {
            this.backImageOffsetX = this.imageOffsetX;
            this.backImageOffsetY = this.imageOffsetY;
          }
      this.updateImage();
    }
  }
  
  onKeyUp(event: any) { 
    this.designName = event.target.value;
  }
  
  toggleShirtSide (string:any) {
    if(string == 'front') this.shirtSideFront = true;
    if(string == 'back') this.shirtSideFront = false;
    this.updateBorder();
  }
  
  updateBorder() {
    //add border
    if(this.shirtSideFront){
      this.currentSide = 'front';
      this.isImgUploaded = false;
      if(this.imageFrontGlobalStore != '') {
        this.image = this.imageFrontGlobalStore;
        this.handleFileChange(event,'changeShirtSide');
        this.base64DataFrontSide = this.globalCanvas.toDataURL('image/png');
        this.updateImageBase64(true);
        this.isImgUploaded = true;
      }
      this.drawImageOnCanvas(this.imageFrontSrc);
      let canvasStyle = document.querySelector('.canvas') as any
      canvasStyle.style.marginTop  = 78 + 'px';
      canvasStyle.style.marginLeft = 122 + 'px';
      this.globalCanvas.height = this.canvasHeightFront;
      this.globalCanvas.width = this.canvasWidthFront;
      this.imageOffsetX = this.frontImageOffsetX;
      this.imageOffsetY = this.frontImageOffsetY;
      this.imageWidth = this.frontImageWidth;
      this.imageHeight = this.frontImageHeight;
    } else {
      this.currentSide = 'back';
      this.isImgUploaded = false;
      if(this.imageBackGlobalStore != '' ) {
        this.image = this.imageBackGlobalStore
        this.handleFileChange(event,'changeShirtSide');
        this.updateImageBase64(false);
        this.isImgUploaded = true;
        this.base64DataBackSide = this.globalCanvas.toDataURL('image/png');
      } 
      this.drawImageOnCanvas(this.imageBackSrc);
      let canvasStyle = document.querySelector('.canvas') as any
      canvasStyle.style.marginTop  = 88 + 'px';
      canvasStyle.style.marginLeft = 109 + 'px';
      this.globalCanvas.height = this.canvasHeightBack;
      this.globalCanvas.width = this.canvasWidthBack;
      this.imageOffsetX = this.backImageOffsetX;
      this.imageOffsetY = this.backImageOffsetY;
      this.imageWidth = this.backImageWidth;
      this.imageHeight = this.backImageHeight;
    }
    const borderSize = 5;
    this.ctx.lineWidth = borderSize;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(borderSize / 2, borderSize / 2, this.globalCanvas.width - borderSize, this.globalCanvas.height - borderSize); 
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
    } else {
      this.imageBackGlobalStore = '';      
      this.backImageOffsetX;
      this.backImageOffsetY;
      this.backImgFormdata = new FormData();
    }
  }
  
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.value); // true or false
  }

  updateImageBase64(side:any){
    side ? this.base64DataFrontSide= this.globalCanvas.toDataURL('image/png'): this.base64DataBackSide = this.globalCanvas.toDataURL('image/png')
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
        userId :  this.userData._id,
        price : this.teeDetailForm.value.price,
        teeName : this.teeDetailForm.value.teeName,
        frontBase64 :  this.base64DataFrontSide,
        backbase64 : this.base64DataBackSide,
        role : this.userData.user_Role,
        frontUrl : this.imageFrontGlobalStore != '' ? this.frontImageName : '' ,
        backUrl : this.imageBackGlobalStore != '' ? this.backImageName : '',
        teeColor : this.imageColor
    }
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

  changeImage(index:any) {
    this.imageFrontSrc = this.imageFrontUrls[index];
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
  
  validateHeight(event: any, boolean : any , number : any): void {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
  
    if (isNaN(value) || value < 1) {
      value = 1; // Set to minimum if input is below range or invalid
    } else if (value > number) {
      value = number; // Set to maximum if input exceeds range
    }
  
    input.value = value.toString(); // Update the input value
    if(boolean ) {
      input.value = value.toString();
      this.imageWidth = value;
    } else {
      input.value = value.toString();
      this.imageHeight = value;
    }
  }

  validatePrice (event: any){
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
  
    if (isNaN(value) || value < 550) {
      value = 550; // Set to minimum if input is below range or invalid
    } else if (value > 1550) {
      value = 1550; // Set to maximum if input exceeds range
    }
    input.value = value.toString(); // Update the input value
    this.priceRange = value;
  }
  
  ngOnDestroy() {
    this.canvas.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.nativeElement.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
  }
}