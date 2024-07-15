import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [CommonModule,HeaderPageComponent,ReactiveFormsModule],
  providers: [AppServiceService],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  teesCount : any = 0;
  currentCanvas : any;
  public ctx : any;
  img : boolean = false;
  teeDatas : any = [];
  currentIndex : number = 0;

  buyPage(data:any) {
      this.router.navigate(['/buy']);
  }
  constructor(private router: Router,private appservice : AppServiceService) { }
  ngOnInit() {
    this.getTees()
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loopIterator()
    }, 100);
  }

  loopIterator(){
    if(this.teeDatas.length != this.currentIndex) { 
      let teeDataId = 'teeData' + this.currentIndex;
      this.currentCanvas = document.getElementById(teeDataId) as HTMLCanvasElement;
      this.ctx = this.currentCanvas.getContext("2d");
      this.loadimage(this.teeDatas[this.currentIndex]);
    }
  }

  loadimage(data:any) {
    const img = new Image();
    const boxWidth : number = this.currentCanvas.width;
    const boxHeight : number = this.currentCanvas.height;
    let newWidth, newHeight;
    if (1 > boxWidth / boxHeight) { // Image is wider
      newWidth = boxWidth;
      newHeight = boxWidth / 1;
    } else { // Image is taller or square
      newHeight = boxHeight;
      newWidth = boxHeight * 1;
    }
    img.src = data.teeName_frontsideImg;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
      this.currentIndex = this.currentIndex + 1;
      this.loopIterator();
    }
    
  }
  getTees() { 
    this.appservice.getTees().subscribe((result)=> {
      console.log(result);
      this.teeDatas = result;
    })
  }
  openCanvas() {
    this.router.navigate(['/canvas']);
  }

}
