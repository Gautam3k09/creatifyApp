import { Component } from '@angular/core';
import { YourTeesComponent } from '../your-tees/your-tees.component';
import { HeaderPageComponent } from '../header-page/header-page.component';
@Component({
  selector: 'app-merch-home-page',
  standalone: true,
  imports: [HeaderPageComponent,YourTeesComponent],
  templateUrl: './merch-home-page.component.html',
  styleUrl: './merch-home-page.component.css'
})
export class MerchHomePageComponent {
  isMerchHomePage = false;
  constructor(){

  }
}
