import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.css'
})
export class HeaderPageComponent {
  // ActiveTab : any = '';
  sidebarClose : any = false

  constructor(private router: Router) { }
  
  onDivClick(string:any) {
    // this.ActiveTab = string;
    console.log(string,'string');
    this.router.navigate([string]);
    this.showSidebar(string);
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
}
