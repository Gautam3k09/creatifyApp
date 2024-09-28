import { Component } from '@angular/core';
// import { CanvasAreaComponent } from '../canvas-area/canvas-area.component';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderPageComponent,LoginModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  isLogin : any = false;
  storedData:any;
  constructor(private dialog: MatDialog,private router: Router,public localStorage: localStorageService) {
    this.storedData = localStorage.getUserLocalStorage();
    if(this.storedData && this.storedData.visitor == null) {
      this.isLogin = this.storedData.LoggedIn;
    } else {
      this.isLogin = false;
    }
  }
  
  ngOnInit(){
    if(this.storedData && this.storedData.visitor != null){
      this.localStorage.removeUserLocalStorage();
      location.reload()
    }
  }
  openCanvas() {
    if(!this.isLogin) {
      this.openModal();
    } else{
      this.router.navigate(['/tees']);
    }
  }

  openModal() {
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.modalDialog = this.dialog.open(LoginModalComponent, this.dialogConfig);
  }
}
