import { Component } from '@angular/core';
import { localStorageService } from '../local-storage-service';

@Component({
  selector: 'app-referral-page',
  standalone: true,
  imports: [],
  templateUrl: './referral-page.component.html',
  styleUrl: './referral-page.component.css'
})
export class ReferralPageComponent {
  localData: any;
  constructor(public localStorage: localStorageService) {
    const data = this.localStorage.getUserLocalStorage();
    if(data && data.userData){
      this.localData = JSON.parse(data.userData).user_Name;
    }

  }

  copy(){
    const tempElement = document.createElement('textarea');
    tempElement.value = 'https://localhost:4200/refferedBy/' + this.localData;
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully')
  }
}
