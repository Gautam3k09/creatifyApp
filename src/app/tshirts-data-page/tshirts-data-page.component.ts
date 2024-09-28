import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-tshirts-data-page',
  standalone: true,
  imports: [CommonModule,NgxUiLoaderModule],
  templateUrl: './tshirts-data-page.component.html',
  styleUrl: './tshirts-data-page.component.css'
})
export class TshirtsDataPageComponent {
  @Input() from :any;
  userId: any;
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
  userData : any;
  canvasfrontHeight = 100;
  canvasbackHeight = 120;
  storedData : any;
  constructor( public appservice: AppServiceService,private router: Router,private ngxLoader: NgxUiLoaderService,public route : ActivatedRoute,public localstorage : localStorageService){
    this.userId = route.snapshot.params['userId'];
    this.storedData = this.localstorage.getUserLocalStorage();
    if(this.storedData && this.storedData.LoggedIn != null){
      this.userData = JSON.parse(this.storedData.userData);
    }
  }

  ngOnInit(){
    this.ngxLoader.start();
    this.getTees();
    this.ngxLoader.stop();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.loopIterator()
    }, 1200);
  }

  getTees() { 
    if(this.from != 'personal'){
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
    } else  {
      let data : any;
      if(this.from == 'personal' && this.storedData.visitor == null) {
        data = {
          id : this.userData._id,
        }
      } else {
        data = {
          id : this.userId,
        }
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
    let boxHeight : any = ''
    if( !data?.teeName_frontsideImg){
      boxHeight = this.canvasbackHeight;
      img.src = data?.teeName_backsideImg;
    }else {
      boxHeight = this.canvasfrontHeight;
      img.src = data?.teeName_frontsideImg;
    }
    const boxWidth : any = this.currentCanvas?.width;
    let newWidth, newHeight;
    if (1 > boxWidth / boxHeight) { // Image is wider
      newWidth = boxWidth;
      newHeight = boxWidth / 1;
    } else { // Image is taller or square
      newHeight = boxHeight;
      newWidth = boxHeight * 1;
    }
    
    // img.src = data?.teeName_frontsideImg;
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
    if(this.storedData != null || this.storedData.Visitor == '') {
      this.router.navigate(['/buy/'+teeData._id]);
    }
  }

  copytext(teeDataId: string){
    let text = 'http://localhost:4200/buy/' + teeDataId;
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully')
  }
  
}
