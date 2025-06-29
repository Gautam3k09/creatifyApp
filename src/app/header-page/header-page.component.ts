import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginViaGoogleComponent } from './login-via-google/login-via-google.component';
import { localStorageService } from '../local-storage-service';

@Component({
    selector: 'app-header-page',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './header-page.component.html',
    styleUrl: './header-page.component.css',
})
export class HeaderPageComponent {
    sidebarClose = false;
    isMenuOpen = false;
    isLoggedIn: string | null = null;
    dialogConfig = new MatDialogConfig();
    modalDialog?: MatDialogRef<LoginViaGoogleComponent>;
    visitor: any = {};
    merchPage = false;

    constructor(
        private router: Router,
        public matDialog: MatDialog,
        public localStorage: localStorageService
    ) {
        const data = this.localStorage.getUserLocalStorage();
        if (data?.LoggedIn) {
            const user = data;
            this.isLoggedIn = user.user_Name || '';
        } else if (data?.visitor && data?.user_id) {
            this.visitor.visitor = data.visitor.toUpperCase();
            this.visitor.user_id = data.user_id;
            this.merchPage = true;
        }
    }

    ngOnInit() { }

    onDivClick(path: string) {
        if (!this.merchPage) {
            this.router.navigate([path]);
        } else {
            this.router.navigate(['/' + this.visitor.visitor + '/merch/' + this.visitor.user_id]);
        }
    }

    showSidebar(string = '') {
        if (string) this.sidebarClose = !this.sidebarClose;
        const sidebar: HTMLElement | null = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.display = this.sidebarClose ? 'flex' : 'none';
        }
    }

    openModal() {
        this.dialogConfig.width = window.innerWidth > 600 ? '25%' : '80%';
        this.dialogConfig.id = 'projects-modal-component';
        this.dialogConfig.height = 'auto';
        this.dialogConfig.disableClose = true;
        this.modalDialog = this.matDialog.open(LoginViaGoogleComponent, this.dialogConfig);
    }

    openMobileHamburger() {
        this.isMenuOpen = !this.isMenuOpen;
    }
}
