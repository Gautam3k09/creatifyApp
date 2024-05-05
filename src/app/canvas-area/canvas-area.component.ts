import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-canvas-area',
  standalone: true,
  imports: [FormsModule],
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
  width = 200; // Initial width
  height = 150; // Initial height

  constructor() {}
  ngOnInit() {
    this.ctx = this.canvas?.nativeElement?.getContext('2d');
    this.canvas.nativeElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.nativeElement.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.nativeElement.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }


  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
  }
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
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  updateImage() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const newX = Math.max(0, this.canvas.nativeElement.width / 2 - this.width / 2); // Center image
    const newY = Math.max(0, this.canvas.nativeElement.height / 2 - this.height / 2);
    this.ctx.drawImage(this.image, newX, newY, this.width, this.height);
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
    if (this.isDragging) {
      const deltaX = event.offsetX - this.startX;
      const deltaY = event.offsetY - this.startY;
      this.startX = event.offsetX;
      this.startY = event.offsetY;
      this.updateImagePosition(deltaX, deltaY);
    }
  }

  updateImagePosition(deltaX: number, deltaY: number) {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const newX = Math.max(0, this.width + deltaX); 
    const newY = Math.max(0, this.height + deltaY);
    this.ctx.drawImage(this.image, newX, newY, this.width, this.height);
  }


  ngOnDestroy() {
    this.canvas.nativeElement.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.nativeElement.removeEventListener('mouseup', this.handleMouseUp);
    this.canvas.nativeElement.removeEventListener('mousemove', this.handleMouseMove);
  }
}
