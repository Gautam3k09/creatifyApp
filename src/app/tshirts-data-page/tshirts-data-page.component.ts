import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxUiLoaderModule, NgxUiLoaderService } from "ngx-ui-loader";
import { localStorageService } from '../local-storage-service';
import { environment } from '../../../environment';

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
  currentMainCanvas : any;
  public ctx : any; 
  public MainCanvasctx: any;
  commonShop : any = '';
  pageCount : number = 1;
  @ViewChild('mainCanvas', { static: false })
  canvasRef_for_Bg!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;  
  DataFetched : boolean = false;
  userData : any;
  canvasfrontHeight = 100;
  canvasbackHeight = 120;
  storedData : any;
  hideLoadbtn : boolean = false;

  imageFrontSrc = 'assets/display-tees/front-black.png';
  imageFrontUrls = [ 
    {key : 'Onyx black', value : 'assets/display-tees/front-black.png'},
    {key : 'Pearl white', value : 'assets/display-tees/front-white.png'},
    {key : 'Sapphire blue', value : 'assets/display-tees/front-blue.png'},
    {key : 'Ruby maroon', value : 'assets/display-tees/front-maroon.png'},    
  ];
  imageBackSrc = 'assets/display-tees/back-black.png';
  imageBackUrls = [
    {key : 'Onyx black', value : 'assets/display-tees/back-black.png'},
    {key : 'Pearl white', value : 'assets/display-tees/back-white.png'},
    {key : 'Sapphire blue', value : 'assets/display-tees/back-blue.png'},
    {key : 'Ruby maroon', value : 'assets/display-tees/back-maroon.png'},
  ];


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
    
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // this.loopIterator()
    }, 1200);
  }

  drawImageOnCanvas(image : any): void {
    const canvas = this.canvasRef_for_Bg?.nativeElement;
    const ctx = this.currentMainCanvas.getContext('2d');
    canvas.width = 175; // You can adjust the width
    canvas.height = 150; // You can adjust the height
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0,canvas.width, canvas.height);
    };    
  }

  getTees() { 
    if(this.from != 'personal'){
      const data = {
        pageNumber:this.pageCount,
      }
      this.appservice.getAlltees(data).subscribe((result)=> {
        if(result){
          if(result.data.length < 1) {
            this.DataFetched = true;
            return;
          }
          if(result.data.length < 12){
            this.hideLoadbtn = true;
          }
          this.teeDatas = this.teeDatas == '' ? result.data : this.teeDatas.concat(result.data);
          setTimeout(() => {
            if(this.teeDatas.length > 0){
                this.loopIterator()
              }
          }, 1500);
        }
      })
    } else  {
      let data : any;
      if(this.from == 'personal' && this.storedData.visitor == null) {
        data = {
          id : this.userData.user_Name,
        }
        console.log('formher')
      } else {
        data = {
          id : this.userId,
        }
      }
      this.appservice.getTees(data).subscribe((result)=> {
        if(result){
          this.teeDatas =  result.data;
          setTimeout(() => {
            if(this.teeDatas.length > 0){
                this.loopIterator()
              } else {
                this.ngxLoader.stop();
              }
          }, 1500);
        }
      });
    }
    
    this.pageCount = this.pageCount + 1
  }

  loopIterator(){
    if(this.teeDatas.length != this.currentIndex) {
      this.changeTshirtColor(this.currentIndex)
      let mainCanvas = 'mainTeeData' + this.currentIndex;
      this.currentMainCanvas = document.getElementById(mainCanvas) as HTMLCanvasElement;
      this.MainCanvasctx = this.currentMainCanvas?.getContext('2d');
      this.drawImageOnCanvas(this.imageFrontSrc);
      
      let teeDataId = 'teeData' + this.currentIndex;
      this.currentCanvas = document.getElementById(teeDataId) as HTMLCanvasElement;
      this.ctx = this.currentCanvas?.getContext("2d");
      this.loadimage(this.teeDatas[this.currentIndex]);
    }
    if(this.teeDatas.length >=  this.currentIndex){
      this.changeTshirtColor(0)
      let mainCanvas = 'mainTeeData' + 0;
      this.currentMainCanvas = document.getElementById(mainCanvas) as HTMLCanvasElement;
      this.MainCanvasctx = this.currentMainCanvas?.getContext('2d');
      this.drawImageOnCanvas(this.imageFrontSrc);
      this.ngxLoader.stop();
    }
  }

  loadimage(data:any) {
    const img = new Image();
    let boxHeight : any = ''
    if( !data?.tee_frontsideImg){
      const screenWidth = window.innerWidth;
      if(screenWidth > 800) {
        this.currentCanvas .style.height = '268px';
        this.currentCanvas .style.marginTop = '-64%';
        this.currentCanvas .style.marginLeft = '30%';
        this.currentCanvas .style.width = '230px';
      } else {
        this.currentCanvas .style.height = '145px';
        this.currentCanvas .style.marginTop = '65px';
        this.currentCanvas .style.marginLeft = '30%';
        this.currentCanvas .style.width = '89px';
      }
      boxHeight = this.canvasbackHeight;
      img.src = data?.tee_backsideImg;
    }else {
      boxHeight = this.canvasfrontHeight;
      img.src = data?.tee_frontsideImg;
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
    
    img.onload = () => {
      if(this.ctx){
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high'; 
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
    let text = environment.frontend + 'buy/' + teeDataId;
    const tempElement = document.createElement('textarea');
    tempElement.value = text;
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully')
  }

  openCanvas(string:any) {
    this.router.navigate([string]);
  }
  
  changeTshirtColor (index:any) {
    if(this.teeDatas.length > 0){
      let data = this.teeDatas[index];
      if( !data.tee_frontsideImg){
        this.imageBackUrls.find((imageData: any) => {
          if(imageData.key == data.tee_Color){
            this.imageFrontSrc = imageData.value
          }
        })
      }else {
        this.imageFrontUrls.find((imageData: any) => {
          if(imageData.key == data.tee_Color){
            this.imageFrontSrc = imageData.value
          }
        })
      }
    }
  }
}
