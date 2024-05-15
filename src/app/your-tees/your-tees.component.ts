import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderPageComponent } from '../header-page/header-page.component';

@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [HeaderPageComponent],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {

  constructor(private router: Router) { }

  openCanvas() {
    this.router.navigate(['/canvas']);
  }
}
