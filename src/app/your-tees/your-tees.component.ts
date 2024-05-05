import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-your-tees',
  standalone: true,
  imports: [],
  templateUrl: './your-tees.component.html',
  styleUrl: './your-tees.component.css'
})
export class YourTeesComponent {

  constructor(private router: Router) { }

  openCanvas() {
    this.router.navigate(['/canvas']);
  }
}
