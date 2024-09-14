import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-tshirts-data-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tshirts-data-page.component.html',
  styleUrl: './tshirts-data-page.component.css'
})
export class TshirtsDataPageComponent {
  img : boolean = false;
  teeDatas : any ='';
  currentIndex : number = 0;
  currentCanvas : any;
  public ctx : any;
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;  
  constructor( public appservice: AppServiceService,){

  }

  ngOnInit(){
    this.getTees();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loopIterator()
    }, 1000);
  }

  getTees() { 
    let id : any = localStorage.getItem('userId');
    id = JSON.parse(id);
    console.log(id,'asd')
    const data = {
      _id : id._id
    }
    this.appservice.getAlltees(data).subscribe((result)=> {
      this.teeDatas = result.data;
    })
  }

  loopIterator(){
    if(this.teeDatas.length != this.currentIndex) { 
      let teeDataId = 'teeData' + this.currentIndex;
      this.currentCanvas = document.getElementById(teeDataId) as HTMLCanvasElement;
      this.ctx = this.currentCanvas?.getContext("2d");
      this.loadimage(this.teeDatas[this.currentIndex]);
    }
  }

  loadimage(data:any) {
    const img = new Image();
    const boxWidth : any = this.currentCanvas?.width;
    const boxHeight : any = this.currentCanvas?.height;
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
      if(this.ctx){

        this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
        this.currentIndex = this.currentIndex + 1;
        this.loopIterator();
      }
    }
  }
}
