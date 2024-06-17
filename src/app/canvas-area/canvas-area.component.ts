import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-canvas-area',
  standalone: true,
  imports: [FormsModule,CommonModule,HeaderPageComponent,ReactiveFormsModule],
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
  startX: any = 50;
  startY: any = 50;
  frontImageOffsetX: any = 0;
  frontImageOffsetY: any = 0;
  backImageOffsetX: any = 0;
  backImageOffsetY: any = 0;
  offsetX = 0; 
  offsetY = 0;
  width = 100; // Initial width
  height = 150; // Initial height
  frontImageWidth : any = 100;
  frontImageHeight : any = 150;
  backImageWidth : any = 100;
  backImageHeight : any = 150;
  isDragging = false;
  isGrabbing: boolean = false;
  public isImgUploaded : boolean = false;
  isPatternApplied: boolean = false;
  designName : any = "";
  teeSize : any = 'S';
  priceRange : any = 550;
  rotationAngle = 0;
  shirtSideFront: boolean = true;
  shirtPreferencesPersonal: boolean = true;
  canvasHeightFront : any = 360;
  canvasHeightBack : any = 480;
  currentSide : any = 'front';

  constructor(private router: Router,private fb: FormBuilder) {}
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
      color   : [this.selectedColor,Validators.required],
      size    : [this.teeSize,Validators.required],
      price   : ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  //  ngafterViewInit should not be removed may be used later 
  // ngAfterViewInit(): void {
  //   this.ctx = this.canvas.nativeElement.getContext('2d');
  // }

  changeColor(color: string): void {
    console.log('Selected color:', color);
    this.fb.control('color').setValue(color);
  }

  handleFileChange(event: any,from = '') {
    this.width = 100;
    this.height = 150;
    if(from == 'changeShirtSide'){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.image = new Image();
        this.image.onload = () => {
          this.updateImage(); 
        };
        this.image.src = e.target.result;
        this.isImgUploaded = true;
      };
      let targetfile = this.shirtSideFront ? this.imageFrontGlobalTarget : this.imageBackGlobalTarget;
      reader.readAsDataURL(targetfile);
      return;
    }
    if(from == 'clearImage'){
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // this.image = new Image();
        this.image.onload = () => {
          this.updateImage(); 
        };
        this.image.src = '';
        this.isImgUploaded = false;
        reader.readAsDataURL(this.image);
      };
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
      this.isImgUploaded = true;
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  updateImage() {
    console.log('here')
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    
    const newX = Math.max(0, Math.min(canvasWidth - this.width, this.offsetX));
    const newY = Math.max(0, Math.min(canvasHeight - this.height, this.offsetY));

    // change direction
    // this.ctx.translate(this.width / 2,canvasHeight / 2);
    // this.ctx.rotate(this.rotationAngle * Math.PI / 180);
    // this.ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

    //image update
    
    if(this.image != '') {
      this.ctx.drawImage(this.image, newX, newY, this.width, this.height);
    }
    //for border
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    const borderSize = 5;
    this.ctx.lineWidth = borderSize;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(borderSize / 2, borderSize / 2, canvas.width - borderSize, canvas.height - borderSize);

    if(this.shirtSideFront) {
      this.frontImageWidth = this.width;
      this.frontImageHeight = this.height;
    } else {
      this.backImageWidth = this.width;
      this.backImageHeight = this.height;
    }
  }

  handleMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.offsetX;
    this.startY = event.offsetY;
    
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleMouseMove(event: MouseEvent) {
    if (this.isDragging && this.isImgUploaded) {
      const deltaX = event.offsetX - this.startX;
      const deltaY = event.offsetY - this.startY;
      this.startX = event.offsetX;
      this.startY = event.offsetY;

      // Update offset values considering canvas boundaries
      this.offsetX = Math.max(0, Math.min(this.offsetX + deltaX, this.canvas.nativeElement.width - this.width));
      this.offsetY = Math.max(0, Math.min(this.offsetY + deltaY, this.canvas.nativeElement.height - this.height));
      if(this.shirtSideFront) {
            this.frontImageOffsetX = this.offsetX;
            this.frontImageOffsetY = this.offsetY;
          } else {
            this.backImageOffsetX = this.offsetX;
            this.backImageOffsetY = this.offsetY;
          }
      this.updateImage();
    } else {
      
    }
  }

  download() {
    // const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    // const dataURL = canvas.toDataURL('image/png');

    // const link = document.createElement('a');
    // link.href = dataURL;
    // link.download = 'my-drawing.png';

    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // const queryParams = { data: 'tees' };
    // this.router.navigate([''], { queryParams: queryParams });
  }

  changeHeight(string:any) {
    this.teeSize = string;
    this.fb.control('size').setValue(this.teeSize);
    // this.isPatternApplied = true;
  }

  rotateImage() {
      this.rotationAngle += 90;

    // Ensure rotation angle stays within 0 to 359 degrees
    this.rotationAngle = (this.rotationAngle + 360) % 360;

    this.updateImage();
  }
  
  ngOnDestroy() {
    this.canvas.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.nativeElement.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
  }


  onKey(event: any) { 
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
        this.isImgUploaded = true;
      }
      let canvasStyle = document.querySelector('canvas') as any
      canvasStyle.style.top = 30 + '%';
      this.globalCanvas.height = this.canvasHeightFront;
      this.offsetX = this.frontImageOffsetX;
      this.offsetY = this.frontImageOffsetY;
      this.width = this.frontImageWidth;
      this.height = this.frontImageHeight;

    } else {
      this.currentSide = 'back';
      this.isImgUploaded = false;
      if(this.imageBackGlobalStore != '' && this.image != '') {
        this.image = this.imageBackGlobalStore
        this.handleFileChange(event,'changeShirtSide');
        this.isImgUploaded = true;
      } 
      let canvasStyle = document.querySelector('canvas') as any
      canvasStyle.style.top = 18 + '%';
      this.globalCanvas.height = this.canvasHeightBack;
      this.offsetX = this.backImageOffsetX;
      this.offsetY = this.backImageOffsetY;
      this.width = this.backImageWidth;
      this.height = this.backImageHeight;
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
    this.offsetX = 0; 
    this.offsetY = 0;
    this.width = 100; 
    this.height = 150;
  }

  onSubmit(form: FormGroup) {
    console.log('Valid?', form.value); // true or false
  }
}



// if front checked 
// codn 1 - > img empty
// codn 2 - > img there but need to change
// codn 3 ->  img was there and changed from back to front