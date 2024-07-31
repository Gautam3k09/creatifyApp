import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.css'
})
export class HeaderPageComponent {
  // ActiveTab : any = '';
  sidebarClose : any = false;
  isLoggedIn : any ;
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  merchPage: boolean = false;
  constructor(private router: Router,public matDialog: MatDialog) { }

  ngOnInit(){
    this.isLoggedIn  = localStorage.getItem('Login');
  }
  
  onDivClick(string:any) {
    // this.ActiveTab = string;
    console.log(string,'string');
    this.router.navigate([string]);
    // this.showSidebar(string);
  }

  showSidebar(string = '') {
    console.log(string,'string');
    if(string != '') this.sidebarClose = !this.sidebarClose;
    const sidebar : any = document.querySelector('.sidebar');
    if(this.sidebarClose) {
      sidebar.style.setProperty('display', 'flex', 'important');
    } else {
      sidebar.style.display = 'none';
    }
  }

  openModal() {
    
    this.dialogConfig.id = "projects-modal-component";
    this.dialogConfig.height = "500px";
    this.dialogConfig.width = "650px";
    this.modalDialog = this.matDialog.open(LoginModalComponent, this.dialogConfig);
  }
}
