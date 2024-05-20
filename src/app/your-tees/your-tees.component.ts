import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [HeaderPageComponent,CommonModule],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {
  teesCount : any = 0;

  constructor(private router: Router) { }

  openCanvas() {
    this.router.navigate(['/canvas']);
  }
}
