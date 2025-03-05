import { Component } from '@angular/core';
import { localStorageService } from '../local-storage-service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment';
@Component({
  selector: 'app-referral-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './referral-page.component.html',
  styleUrl: './referral-page.component.css'
})
export class ReferralPageComponent {
  localData: any;
  isCopied = false;
  constructor(public localStorage: localStorageService) {
    const data = this.localStorage.getUserLocalStorage();
    if(data && data.userData){
      this.localData = JSON.parse(data.userData).user_Name;
    }

  }

  copy(){
    const tempElement = document.createElement('textarea');
    tempElement.value = `${environment.frontend}refferedBy/` + this.localData;
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully');
    this.isCopied = true;
    setTimeout(() => this.isCopied = false, 1000);
  }
}
