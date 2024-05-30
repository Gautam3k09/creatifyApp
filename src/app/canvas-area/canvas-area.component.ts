import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderPageComponent } from '../header-page/header-page.component';
@Component({
  selector: 'app-canvas-area',
  standalone: true,
  imports: [FormsModule,CommonModule,HeaderPageComponent],
  templateUrl: './canvas-area.component.html',
  styleUrl: './canvas-area.component.css'
})
export class CanvasAreaComponent {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  public ctx:any;
  public selectedColor: any = '';
  image: any;
  isDragging = false;
  startX: any;
  startY: any;
  offsetX = 0; 
  offsetY = 0;
  width = 100; // Initial width
  height = 150; // Initial height
  isGrabbing: boolean = false;
  isImgUploaded : boolean = false;
  isPatternApplied: boolean = false;
  name : any = "";
  size : any = 'S';
  priceRange : any = 550;
  rotationAngle = 0;
  shirtSideFront: boolean = true;
  shirtPreferencesPersonal: boolean = true;

  constructor(private router: Router) {}
  ngOnInit() {
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.ctx = this.canvas?.nativeElement?.getContext('2d');
    //border
    const borderSize = 5;
    this.ctx.lineWidth = borderSize;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(borderSize / 2, borderSize / 2, canvas.width - borderSize, canvas.height - borderSize);  
    //image move
    this.canvas.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }
  // ngAfterViewInit(): void {
  //   this.ctx = this.canvas.nativeElement.getContext('2d');
  // }
  changeColor(color: string): void {
    console.log('Selected color:', color);
  }
  handleFileChange(event: any) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        this.image = img;
        this.updateImage(); 
      };
      img.src = e.target.result;
      this.isImgUploaded = true;
    };
    reader.readAsDataURL(event.target.files[0]);
  }
  updateImage() {
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
    
    this.ctx.drawImage(this.image, newX, newY, this.width, this.height);

    //for border
    const canvas = this.canvas.nativeElement as HTMLCanvasElement;
    const borderSize = 5;
    this.ctx.lineWidth = borderSize;
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(borderSize / 2, borderSize / 2, canvas.width - borderSize, canvas.height - borderSize);
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
      console.log(this.isDragging)
      const deltaX = event.offsetX - this.startX;
      const deltaY = event.offsetY - this.startY;
      this.startX = event.offsetX;
      this.startY = event.offsetY;

      // Update offset values considering canvas boundaries
      this.offsetX = Math.max(0, Math.min(this.offsetX + deltaX, this.canvas.nativeElement.width - this.width));
      this.offsetY = Math.max(0, Math.min(this.offsetY + deltaY, this.canvas.nativeElement.height - this.height));
      this.updateImage();
    } else {

    }
  }

  updateImagePosition(deltaX: number, deltaY: number) {
    this.offsetX += deltaX; // Update offset based on drag movement
    this.offsetY += deltaY;
    this.offsetX = Math.max(0, this.offsetX); // Prevent off-screen (left)
    this.offsetY = Math.max(0, this.offsetY); // Prevent off-screen (top)
    this.offsetX = Math.min(this.canvas.nativeElement.width - this.width, this.offsetX); // Prevent off-screen (right)
    this.offsetY = Math.min(this.canvas.nativeElement.height - this.height, this.offsetY); // Prevent off-screen (bottom)
    console.log(this.offsetX,this.offsetY,'asd')
    this.updateImage();
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
    this.size = string;
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
    this.name = event.target.value;
  }

  toggleShirtSide (string:any) {
    if(string == 'front') this.shirtSideFront = true;
    if(string == 'back') this.shirtSideFront = false;
  }

  toggleShirtpreference (string:any) {
    if(string == 'personal') this.shirtPreferencesPersonal = true;
    if(string == 'merch') this.shirtPreferencesPersonal = false;
  }
}
