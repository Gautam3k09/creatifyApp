import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buy-page',
  standalone: true,
  imports: [CommonModule,HeaderPageComponent,ReactiveFormsModule],
  templateUrl: './buy-page.component.html',
  styleUrl: './buy-page.component.css'
})
export class BuyPageComponent {
  constructor() {
  }
  changeColor(string: string) {
    console.log(string,'string')
  }
}
