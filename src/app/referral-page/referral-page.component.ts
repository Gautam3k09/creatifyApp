import { Component } from '@angular/core';

@Component({
  selector: 'app-referral-page',
  standalone: true,
  imports: [],
  templateUrl: './referral-page.component.html',
  styleUrl: './referral-page.component.css'
})
export class ReferralPageComponent {

  copy(){
    const tempElement = document.createElement('textarea');
    tempElement.value = 'text';
    document.body.appendChild(tempElement); 
    tempElement.select();
    document.execCommand('copy');
    document.body.removeChild(tempElement); 
    window.alert('Text copied successfully')
  }
}
