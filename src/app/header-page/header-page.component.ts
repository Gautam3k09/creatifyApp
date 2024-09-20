import { Component, Input } from '@angular/core';
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
  sidebarClose : any = false;
  isLoggedIn : any ;
  dialogConfig = new MatDialogConfig();
  modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
  visit : any = '';
  @Input() merchPage: any = false;
  @Input() merchName: any = '';
  constructor(private router: Router,public matDialog: MatDialog) { }

  ngOnInit(){
    if(this.merchPage == 'merchant') this.merchPage = true
    this.isLoggedIn  = localStorage.getItem('Login');
    console.log('isLoggedIn', this.isLoggedIn);
    let data : any = (localStorage.getItem('userId'));
    data = JSON.parse(data);
    this.visit = sessionStorage.getItem("visit");
    if(this.visit != '') this.merchName = this.visit
  }
  
  onDivClick(string:any) {
    if(!this.merchPage && this.visit == '') {
      this.router.navigate([string]);
    } else {
      this.router.navigate(['/'+ string + '/merch']);
    }
    console.log(string,'string');
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
