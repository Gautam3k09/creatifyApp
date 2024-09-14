import { Component} from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { TshirtsDataPageComponent } from "../tshirts-data-page/tshirts-data-page.component";
@Component({
  selector: 'app-common-shop',
  standalone: true,
  imports: [HeaderPageComponent, TshirtsDataPageComponent],
  templateUrl: './common-shop.component.html',
  styleUrl: './common-shop.component.css'
})
export class CommonShopComponent {

  constructor(){

  }

  ngOnInit(){
    // this.getTees();
  }

}
