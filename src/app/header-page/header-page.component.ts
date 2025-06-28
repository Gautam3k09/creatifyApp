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
    styleUrl: './header-page.component.css',
})
export class HeaderPageComponent {
    sidebarClose: any = false;
    isMenuOpen = false;
    isLoggedIn: any = "";
    dialogConfig = new MatDialogConfig();
    modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
    visitor: any = {};
    merchPage: any = false;
    constructor(
        private router: Router,
        public matDialog: MatDialog,
        public localStorage: localStorageService
    ) {
        let data = this.localStorage.getUserLocalStorage();
        if (data && data.userData && !data?.visitor) {
            data = JSON.parse(data.userData)
            this.isLoggedIn = data.user_Name;
            this.visitor = '';
        } else if (data && data.visitor && data.user_id) {
            console.log('visitor data', data);
            this.visitor.visitor = data.visitor.toUpperCase();
            this.visitor.user_id = data.user_id;
            this.isLoggedIn = ''
        }
    }

    ngOnInit() {
        if (this.visitor != '') {
            this.merchPage = true;
            if (this.visitor != '') this.visitor = this.visitor;
        }
    }

    onDivClick(string: any) {
        if (!this.merchPage) {
            this.router.navigate([string]);
        } else {
            this.router.navigate(['/' + this.visitor.visitor + '/merch/' + this.visitor.user_id]);
        }
    }

    showSidebar(string = '') {
        if (string != '') this.sidebarClose = !this.sidebarClose;
        const sidebar: any = document.querySelector('.sidebar');
        if (this.sidebarClose) {
            sidebar.style.setProperty('display', 'flex', 'important');
        } else {
            sidebar.style.display = 'none';
        }
    }

    openModal() {
        let width = window.innerWidth;
        if (width > 600) {
            this.dialogConfig.width = '25%';
        } else {
            this.dialogConfig.width = '80%';
        }
        this.dialogConfig.id = 'projects-modal-component';
        this.dialogConfig.height = 'auto';
        this.modalDialog = this.matDialog.open(LoginModalComponent, this.dialogConfig);
    }

    openMobileHamburger() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
