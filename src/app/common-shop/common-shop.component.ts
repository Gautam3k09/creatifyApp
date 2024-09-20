import { Component, input, Input} from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { TshirtsDataPageComponent } from "../tshirts-data-page/tshirts-data-page.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-common-shop',
  standalone: true,
  imports: [HeaderPageComponent, TshirtsDataPageComponent],
  templateUrl: './common-shop.component.html',
  styleUrl: './common-shop.component.css'
})
export class CommonShopComponent {
  
  @Input() fromMerchLink: any ;
  @Input() merchName: any;

  constructor(public router:Router){

  }

  ngOnInit(){
    if(!this.merchName) this.merchName = 'common' 
    if(localStorage.getItem('userId')!= null && sessionStorage.getItem("visit") != '') {
      this.router.navigate(['']);
    }
  }

}
