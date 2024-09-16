import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";

@Component({
  selector: 'app-tshirts-data-page',
  standalone: true,
  imports: [CommonModule,NgxUiLoaderModule],
  templateUrl: './tshirts-data-page.component.html',
  styleUrl: './tshirts-data-page.component.css'
})
export class TshirtsDataPageComponent {
  @Input() from: any;
  img : boolean = false;
  teeDatas : any =[];
  currentIndex : number = 0;
  currentCanvas : any;
  public ctx : any;
  commonShop : any = '';
  pageCount : number = 1;
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;  
  DataFetched : boolean = false;
  localData : any;
  constructor( public appservice: AppServiceService,private router: Router,private ngxLoader: NgxUiLoaderService,){

  }

  ngOnInit(){
    this.ngxLoader.start();
    this.setLocalStorage();
    this.getTees();
    this.ngxLoader.stop();
  }

  setLocalStorage(){
    this.localData = localStorage.getItem('userId');
    this.localData = JSON.parse(this.localData);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loopIterator()
    }, 1000);
  }

  getTees() { 
    if(this.from == 'common'){
      const data = {
        pageNumber:this.pageCount
      }
      this.appservice.getAlltees(data).subscribe((result)=> {
        if(result){
          if(result.data.length < 1) {
            this.DataFetched = true;
            return;
          }
          this.teeDatas = this.teeDatas == ''? result.data : this.teeDatas.concat(result.data);
        }
      })
    } else if(this.from == 'personal') {
      const data = {
        id : this.localData._id,
      }
      this.appservice.getTees(data).subscribe((result)=> {
        if(result){
          this.teeDatas =  result.data;
        }
      });
    }
    setTimeout(() => {
      this.loopIterator()
    }, 1500);
    this.pageCount = this.pageCount + 1
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
    img.src = data?.teeName_frontsideImg;
    img.onload = () => {
      if(this.ctx){

        this.ctx.drawImage(img, 0, 0, newWidth, newHeight);
        this.currentIndex = this.currentIndex + 1;
        this.loopIterator();
      }
    }
  }

  deleteTees(data:any) {
    this.appservice.deleteTees(data).subscribe(
      (res) => {
        this.teeDatas.forEach((element:any,index:any) => {
          if(element._id === data) this.teeDatas.splice(index,1);
        });
      }
    );
  }


  navigateBuyPage(teeData:any) {
    console.log(teeData._id,'teedata')
    if(localStorage.getItem('userId')!= null) {
      this.router.navigate(['/buy/'+teeData._id]);
    }
  }

  copytext(teeDataId: string){
    let text = 'http://localhost:4200/buy/' + teeDataId
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully')
  }
  
}
