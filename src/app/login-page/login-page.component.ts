import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  mobileNumber :any = '';
  constructor(private router: Router){

  }

  onkeyUp(data:any){
    this.mobileNumber = data.target.value;
    console.log(this.mobileNumber);
  }

  login() {
    localStorage.setItem('Login', 'true');
    location.reload()
  }
}
