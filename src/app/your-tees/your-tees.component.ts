import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [CommonModule,HeaderPageComponent,ReactiveFormsModule],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  teesCount : any = 0;
  public ctx : any;
  img : boolean = false;

  constructor(private router: Router) { }
  // ngOnInit() {
  // }
  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext("2d");
    console.log(this.ctx,'ctx');
    // const borderSize = 5;
    //   this.ctx.lineWidth = borderSize;
    //   this.ctx.strokeStyle = 'black';
    //   this.ctx.strokeRect(borderSize / 2, borderSize / 2, 250- borderSize, 250 - borderSize); 
      this.loadimage()
  }

  loadimage() {
    const canvas = this.canvasRef.nativeElement;
    const img = new Image();
    const boxWidth : number = canvas.width;
    const boxHeight : number = canvas.height;
    const imageRatio : any = img.width / img.height;
    let newWidth, newHeight;

    if (1 > boxWidth / boxHeight) { // Image is wider
      newWidth = boxWidth;
      newHeight = boxWidth / 1;
    } else { // Image is taller or square
      newHeight = boxHeight;
      newWidth = boxHeight * 1;
    }
    img.src = '../../assets/canvas-image (1).png';
    console.log(imageRatio,'asd');
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
    
  }
  openCanvas() {
    this.router.navigate(['/canvas']);
  }
}
