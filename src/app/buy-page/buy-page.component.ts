import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-buy-page',
  standalone: true,
  imports: [CommonModule,HeaderPageComponent,ReactiveFormsModule],
  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css'
})
export class BuyPageComponent implements OnInit  {
  @Input() data: any;
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  
  constructor(public bsModalRef: BsModalRef) {
    
  }
  ngOnInit() {
    this.loadimage()
  }
  changeColor(string: string) {
    console.log(string,'string')
  }
  
  loadimage() {
    let canvas : any  = this.canvas.nativeElement as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    const img = new Image();
    const boxWidth : number = canvas.width;
    const boxHeight : number = canvas.height;
    let newWidth, newHeight;
    if (1 > boxWidth / boxHeight) { // Image is wider
      newWidth = boxWidth;
      newHeight = boxWidth / 1;
    } else { // Image is taller or square
      newHeight = boxHeight;
      newWidth = boxHeight * 1;
    }
    img.src = this.data.teeName_frontsideImg;
    img.onload = () => {
      
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
  }
}
