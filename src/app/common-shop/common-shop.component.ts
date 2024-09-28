import { Component, input, Input} from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { TshirtsDataPageComponent } from "../tshirts-data-page/tshirts-data-page.component";
import { Router } from '@angular/router';
import { localStorageService } from '../local-storage-service';
@Component({
  selector: 'app-common-shop',
  standalone: true,
  imports: [HeaderPageComponent, TshirtsDataPageComponent],
  templateUrl: './common-shop.component.html',
  styleUrl: './common-shop.component.css'
})
export class CommonShopComponent {
  
  @Input() fromMerchLink: any ;
  visitorName: any;
  storedData: any;

  constructor(public router:Router,public localStorage:localStorageService){
    this.storedData = this.localStorage.getUserLocalStorage();
    if(this.storedData && this.storedData.visitor !=null){
      this.visitorName = this.storedData.visitor;
      let path = window.location.pathname;
      if(path == '/shop'){
        this.router.navigate(['']);
      }
    }
  }

  ngOnInit(){
    
  }

}
