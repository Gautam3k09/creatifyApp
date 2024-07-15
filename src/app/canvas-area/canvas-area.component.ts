import { Component, ElementRef, ViewChild,inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AppServiceService } from '../app-service.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-canvas-area',
  standalone: true,
  imports: [FormsModule,CommonModule,HeaderPageComponent,ReactiveFormsModule],
  providers:[AppServiceService],
  templateUrl: './canvas-area.component.html',
  styleUrl: './canvas-area.component.css'
})
export class CanvasAreaComponent {
  teeDetailForm!: FormGroup;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageInput') fileInput: any;

  public ctx:any;
  public selectedColor: any = 'black';
  
  globalCanvas: any = '';
  
  image: any = '';
  imageFncvar:any = '';
  imageFrontGlobalStore:any = '';
  imageBackGlobalStore:any = '';
  imageFrontGlobalTarget:any = '';
  imageBackGlobalTarget:any = '';
  imagestartXaxis: any = 50;
  imagestartYaxis: any = 50;
  frontImageOffsetX: any = 0;
  frontImageOffsetY: any = 0;
  backImageOffsetX: any = 0;
  backImageOffsetY: any = 0;
  imageOffsetX = 0; 
  imageOffsetY = 0;
  imageWidth = 100; // Initial width
  imageHeight = 150; // Initial height
  frontImageWidth : any = 100;
  frontImageHeight : any = 150;
  backImageWidth : any = 100;
  backImageHeight : any = 150;
  isDragging = false;
  isGrabbing: boolean = false;
  public isImgUploaded : boolean = false;
  isPatternApplied: boolean = false;
  base64DataFrontSide : any = '';
  base64DataBackSide : any = '';
  imageUrl : any = '';
  
  designName : any = "";
  teeSize : any = 'S';
  priceRange : any = 550;
  rotationAngle = 0;
  
  shirtSideFront: boolean = true;
  shirtPreferencesPersonal: boolean = true;
  canvasHeightFront : any = 360;
  canvasHeightBack : any = 480;
  currentSide : any = 'front';

  constructor(private router: Router,private fb: FormBuilder,private sanitizer:DomSanitizer, private appservice:AppServiceService) {}
  ngOnInit() {
    //declared canvas globally for common front and back rendering
    this.globalCanvas = this.canvas.nativeElement as HTMLCanvasElement;

    // with ctx we gonna change aspect ratio
    this.ctx = this.canvas?.nativeElement?.getContext('2d');
    // update border
    this.updateBorder()
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
  // ngAfterViewInit(): void {
  //   this.ctx = this.canvas.nativeElement.getContext('2d');
  // }

  

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
    if(from == 'clearImage'){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.image.onload = () => {
          this.updateImage(); 
        };
        this.image.src = '';
        if(this.shirtSideFront) {
          this.base64DataFrontSide ='';
        } else {
          this.base64DataBackSide = '';
        }
        this.isImgUploaded = false;
        reader.readAsDataURL(this.image);
      };
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        if(this.shirtSideFront) {
          this.imageFrontGlobalStore = img;
          this.imageFrontGlobalTarget = event.target.files[0];
        } else {
          this.imageBackGlobalStore = img;
          this.imageBackGlobalTarget = event.target.files[0];
        }
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

  updateImage(string : any = '') {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    
    const newX = Math.max(0, Math.min(canvasWidth - this.imageWidth, this.imageOffsetX));
    const newY = Math.max(0, Math.min(canvasHeight - this.imageHeight, this.imageOffsetY));

    //image update
    
    if(this.image != '') {
      this.ctx.drawImage(this.image, newX, newY, this.imageWidth, this.imageHeight);
    }
    //for border
    if(string != 'borderNone') {
      const canvas = this.canvas.nativeElement as HTMLCanvasElement;
      const borderSize = 5;
      this.ctx.lineWidth = borderSize;
      this.ctx.strokeStyle = 'black';
      this.ctx.strokeRect(borderSize / 2, borderSize / 2, canvas.width - borderSize, canvas.height - borderSize);
    }

    if(this.shirtSideFront) {
      this.frontImageWidth = this.imageWidth;
      this.frontImageHeight = this.imageHeight;
    } else {
      this.backImageWidth = this.imageWidth;
      this.backImageHeight = this.imageHeight;
    }
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
  
  rotateImage() {
    this.rotationAngle += 90;
    
    // Ensure rotation angle stays within 0 to 359 degrees
    this.rotationAngle = (this.rotationAngle + 360) % 360;
    
    this.updateImage();
  }
  
  onKeyUp(event: any) { 
    this.designName = event.target.value;
  }
  
  toggleShirtSide (string:any) {
    if(string == 'front') this.shirtSideFront = true;
    if(string == 'back') this.shirtSideFront = false;
    this.updateBorder();
  }
  
  toggleShirtpreference (string:any) {
    if(string == 'personal') this.shirtPreferencesPersonal = true;
    if(string == 'merch') this.shirtPreferencesPersonal = false;
  }
  
  updateBorder() {
    //add border
    if(this.shirtSideFront){
      this.currentSide = 'front';
      this.isImgUploaded = false;
      if(this.imageFrontGlobalStore != '' && this.image != '') {
        this.image = this.imageFrontGlobalStore
        this.handleFileChange(event,'changeShirtSide');
        this.base64DataFrontSide = this.globalCanvas.toDataURL('image/png');
        this.isImgUploaded = true;
      }
      let canvasStyle = document.querySelector('canvas') as any
      canvasStyle.style.top = 30 + '%';
      this.globalCanvas.height = this.canvasHeightFront;
      this.imageOffsetX = this.frontImageOffsetX;
      this.imageOffsetY = this.frontImageOffsetY;
      this.imageWidth = this.frontImageWidth;
      this.imageHeight = this.frontImageHeight;
    } else {
      this.currentSide = 'back';
      this.isImgUploaded = false;
      if(this.imageBackGlobalStore != '' && this.image != '') {
        this.image = this.imageBackGlobalStore
        this.handleFileChange(event,'changeShirtSide');
        this.isImgUploaded = true;
        this.base64DataBackSide = this.globalCanvas.toDataURL('image/png');
      } 
      let canvasStyle = document.querySelector('canvas') as any
      canvasStyle.style.top = 18 + '%';
      this.globalCanvas.height = this.canvasHeightBack;
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
  }

  changeColor(color: string): void {
    //console.log(color);
  }
  
  onSubmit(form: FormGroup) {
    console.log('Valid?', form.value); // true or false
  }
  
  // will be moved to show store
  extractBase64Data(dataURL: string) {
    this.imageUrl = dataURL;
    // this.getTrustedImageUrl();
  }
  
  getTrustedImageUrlFront(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64DataFrontSide);
  }
  
  getTrustedImageUrlBack(): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.base64DataBackSide);
  }
  
  download() {
    // const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const dataURL = this.globalCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'canvas-image.png';
    document.body.appendChild(link);
    link.click();
   
    // const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    // if(this.imageFrontGlobalStore != '') {
    //   this.toggleShirtSide('front');
    //   this.updateImage('borderNone')
    //    this.base64DataFrontSide = canvas.toDataURL('image/png');
    // }
    // if(this.imageBackGlobalStore != '') {
    //   this.toggleShirtSide('back')
    //   this.updateImage('borderNone')
    //   this.base64DataBackSide = canvas.toDataURL('image/png');
    //  }
    // const dataURL = canvas.toDataURL('image/png');
  
    // const link = document.createElement('a');
    // link.href = this.base64DataFrontSide;
    // link.download = 'my-drawing.png';
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // const link2 = document.createElement('a');
    // link2.href = this.base64DataBackSide;
    // link2.download = 'my-drawing.png';
    // document.body.appendChild(link2);
    // link2.click();
    // document.body.removeChild(link2);
    // const queryParams = { data: 'tees' };
    // this.router.navigate([''], { queryParams: queryParams });
  }
  
  uploadImage() : any{
    console.log(this.teeDetailForm.value,'teeDetailForm');
    const data = {
      id :  1,
      price : this.teeDetailForm.value.price,
      teeName : this.teeDetailForm.value.teeName,
      frontBase64 :  this.base64DataFrontSide,
      backbase64 : this.base64DataBackSide
    }
    this.appservice.postImage(data).subscribe();
    this.router.navigate(['/tees']);
  }
  
  
  ngOnDestroy() {
    this.canvas.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.nativeElement.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
  }
}