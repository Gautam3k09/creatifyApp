import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BuyPageComponent } from "../buy-page/buy-page.component";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';


@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [CommonModule, HeaderPageComponent, ReactiveFormsModule, BuyPageComponent,LoginModalComponent],
  providers: [AppServiceService,BsModalService],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {
  @Input() isMerchHomePage: any = false;
  @ViewChild('canvas', { static: false })
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  canvasRef!: ElementRef<HTMLCanvasElement>;
  modalRef?: BsModalRef;
  teesCount : any = 0;
  currentCanvas : any;
  public ctx : any;
  img : boolean = false;
  teeDatas : any = [];
  currentIndex : number = 0;
  selectedTee : any;
  isLogin : any = false;

  
  constructor(private router: Router,private appservice : AppServiceService,private modalService: BsModalService,public matDialog: MatDialog) { }

  ngOnInit() {
    console.log(this.isMerchHomePage,'isMerchHomePage')
    this.isLogin  = localStorage.getItem('Login');
    console.log(this.isLogin,'logsin')
    this.getTees();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.loopIterator()
    }, 1000);
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
    const boxWidth : any = this.currentCanvas.width;
    const boxHeight : any = this.currentCanvas.height;
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
    console.log('here')
    const data = {
      id : localStorage.getItem('userId')
    }
    this.appservice.getTees(data).subscribe((result)=> {
      this.teeDatas = result;
    })
  }

  deleteTees(data:any) {
    console.log(data,'data')
    this.appservice.deleteTees(data).subscribe(
      (res) => {
        console.log(res);
        this.teeDatas.forEach((element:any,index:any) => {
          if(element._id === data) this.teeDatas.splice(index,1);
        });
      }
    );
  }
  
  openCanvas(string:any) {
    this.router.navigate([string]);
  }

  navigateBuyPage(teeData:any) {
    if(this.isLogin) {
    this.selectedTee = teeData; 
    this.router.navigate(['/buy'], { state: { data: this.selectedTee } });
    } else {
      this.openModal()
    }
  }
  openModal() {
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.modalDialog = this.matDialog.open(LoginModalComponent,this.dialogConfig);
    localStorage.setItem('apiData', '123');
  }
}
