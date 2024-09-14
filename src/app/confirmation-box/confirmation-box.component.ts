import { Component, Inject, input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-confirmation-box',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-box.component.html',
  styleUrl: './confirmation-box.component.css'
})
export class ConfirmationBoxComponent {
  
  public title: any;
  public message: any;
  public for:any
  constructor(private appservice : AppServiceService, private router: Router,@Inject(MAT_DIALOG_DATA) public data: {title: any,message:any,for:any ,input : any},public dialogRef: MatDialogRef<ConfirmationBoxComponent> ) {
  }
  ngOnInit() {
    this.title = this.data?.title;
    this.message = this.data?.message;
    this.for = this.data?.for;
  }

  closeModal() {
    if (this.for == 'logout'){
      localStorage.removeItem("Login");
      this.router.navigate(['']);
      this.dialogRef.close();
    }
    if (this.for == 'withdraw') {
      this.appservice.postQuestion(this.data.input).subscribe((response) => {
        if(response){
          this.dialogRef.close('withdraw');
        } else{
  
        }
      });
      
    }
    
  }

}
