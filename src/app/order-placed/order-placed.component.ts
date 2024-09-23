import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-placed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.css'
})
export class OrderPlacedComponent {
  fromCod = true;
  finalPrice = 0;
  constructor(private router: Router,@Inject(MAT_DIALOG_DATA) public data: {from: any,buyPageData:any,userData:any,finalPrice:any},public dialogRef: MatDialogRef<OrderPlacedComponent> ) { }

  ngOnInit(){
    this.finalPrice = this.data.finalPrice + 59 ;
    if(this.data.from == 'cod') {
      this.fromCod = true;
    } else {
      this.fromCod = false;
    }
  }

  placeOrder(){
    this.fromCod = false
  }

  closeModal(){
    this.dialogRef.close();
  }

  redirectShop(){
    let visit = sessionStorage.getItem("visit");
    if(visit == '') {
      this.closeModal();
      this.router.navigate(['/shop']);
    } else {
      this.closeModal();
      this.router.navigate(['/'+ visit + '/merch/' + this.data.buyPageData.user_Id ]);
    }
  }

}
