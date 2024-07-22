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
  globalCanvas : any;
  globalctx: any;
  imageSideFront :any = true;
  constructor(public bsModalRef: BsModalRef) {
    
  }
  ngOnInit() {
    this.data = history.state?.data;
    this.globalCanvas = this.canvas.nativeElement as HTMLCanvasElement;
    this.globalctx= this.globalCanvas.getContext("2d");
    this.loadimage()
    console.log(this.data)
  }
  changeColor(string: string) {
    console.log(string,'string')
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
    img.src = this.imageSideFront ? this.data.teeName_frontsideImg: this.data.teeName_backsideImg;
    img.onload = () => {
      this.globalctx.drawImage(img, 0, 0, newWidth, newHeight);
    }
  }
  
  changeSide(){
    this.imageSideFront = !this.imageSideFront;
    this.loadimage()
  }
}
