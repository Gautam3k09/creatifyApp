import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderPageComponent,FooterComponent,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  isLogin : any = false;
  storedData:any;
  images: string[] = [
    'assets/home-page-display/untitled.png',
    'assets/home-page-display/white-createefi.png',
  ];
  currentSlide: number = 0;

  constructor(private dialog: MatDialog,private router: Router,public localStorage: localStorageService,route: ActivatedRoute) {
    this.storedData = localStorage.getUserLocalStorage();
    if(this.storedData && this.storedData.visitor == null) {
      this.isLogin = this.storedData.LoggedIn;
    } else {
      this.isLogin = false;
      let userName = route.snapshot.params['userName'];
      console.log(userName);
      if(userName) {
        this.openCanvas(userName);
      }
    }
  }
  
  ngOnInit(){
    this.startAutoSlide();
    if(this.storedData && this.storedData.visitor != null){
      this.localStorage.removeUserLocalStorage();
      location.reload()
    }

  }
  openCanvas(name:any='') {
    if(!this.isLogin) {
      this.openModal(name);
    } else{
      this.router.navigate(['/create']);
    }
  }

  openModal(name:any='') {
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.dialogConfig.data = name;
    this.modalDialog = this.dialog.open(LoginModalComponent, this.dialogConfig);
  }

  startAutoSlide(): void {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.images.length;
    }, 2000); // Change every 3 seconds
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

}
