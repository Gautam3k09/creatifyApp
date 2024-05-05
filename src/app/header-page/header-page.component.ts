import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonShopComponent } from '../common-shop/common-shop.component';
import { StoreComponent } from '../store/store.component';
import { YourTeesComponent } from '../your-tees/your-tees.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-header-page',
  standalone: true,
  imports: [CommonShopComponent,CommonModule,StoreComponent,YourTeesComponent,HomeComponent],
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.css'
})
export class HeaderPageComponent {
  ActiveTab : any = '';
  boolean : any = false

  onDivClick(string:any) {
    this.ActiveTab = string;
    console.log(this.ActiveTab)
  }
}
