import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.css'
})
export class HeaderPageComponent {
  sidebarClose : any = false;
  isLoggedIn : any ;
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  visitor : any = '';
  storedData : any ;
  merchPage : any = false;
  constructor(private router: Router,public matDialog: MatDialog,public localStorage : localStorageService) {
    this.storedData = this.localStorage.getUserLocalStorage();
    if(this.storedData){
      this.visitor = this.storedData.visitor ? this.storedData.visitor : '';
      this.isLoggedIn = this.storedData.LoggedIn ? this.storedData.LoggedIn: '';
    }
   }

  ngOnInit(){
    if(this.visitor != '') this.merchPage = true;
    if(this.visitor != '') this.visitor = this.visitor;
  }
  
  onDivClick(string:any) {
    if(!this.merchPage && this.visitor != null) {
      this.router.navigate([string]);
    } else {
      this.router.navigate(['/'+ string + '/merch/' + this.storedData.user_id]);
    }
  }

  showSidebar(string = '') {
    if(string != '') this.sidebarClose = !this.sidebarClose;
    const sidebar : any = document.querySelector('.sidebar');
    if(this.sidebarClose) {
      sidebar.style.setProperty('display', 'flex', 'important');
    } else {
      sidebar.style.display = 'none';
    }
  }

  openModal() {
    let width = window.innerWidth;
    if(width > 600) {
      this.dialogConfig.width = "30%";
    } else {
      this.dialogConfig.width = "80%";
    }
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "auto";
    this.modalDialog = this.matDialog.open(LoginModalComponent, this.dialogConfig);
  }
}
