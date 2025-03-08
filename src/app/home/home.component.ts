import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderPageComponent,FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  isLogin : any = false;
  storedData:any;
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
    if(this.storedData && this.storedData.visitor != null){
      this.localStorage.removeUserLocalStorage();
      location.reload()
    }

    document.addEventListener("DOMContentLoaded", () => {
      const video: HTMLVideoElement | null = document.getElementById("myVideo") as HTMLVideoElement;
      
      if (video) {
          // video.muted = true; 
          // video.src = "../../assets/createefi-trial0000-0250.mp4"; 
          // video.load();
          // video.play().catch(error => console.error("Video play failed:", error));
      } else {
          // window.location.reload();
          console.error("Video element not found!");
      }
  });
  }
  openCanvas(name:any='') {
    if(!this.isLogin) {
      this.openModal(name);
    } else{
      this.router.navigate(['/tees']);
    }
  }

  openModal(name:any='') {
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.dialogConfig.data = name;
    this.modalDialog = this.dialog.open(LoginModalComponent, this.dialogConfig);
  }
}
