import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';

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
  constructor(private router: Router,@Inject(MAT_DIALOG_DATA) public data: {from: any,buyPageData:any,userData:any,finalPrice:any,address:any},public dialogRef: MatDialogRef<OrderPlacedComponent> , private appservice : AppServiceService) { }

  ngOnInit(){
    this.finalPrice = this.data.finalPrice + 59 ;
    if(this.data.from == 'cod') {
      this.fromCod = true;
    } else {
      this.fromCod = false;
    }
  }

  closeModal(string:any){
    this.dialogRef.close(string);
  }

  redirectShop(){
    let visit = sessionStorage.getItem("visit");
    if(visit == '') {
      this.closeModal('shop');
      this.router.navigate(['/shop']);
    } else {
      this.closeModal('shop');
      this.router.navigate(['/'+ visit + '/merch/' + this.data.buyPageData.user_Id ]);
    }
  }

  placeOrder(){
    let data = {
      tshirtId : this.data.buyPageData._id,
      by: this.data.userData.user_Name,
      madeBy: this.data.buyPageData.user_Id,
      address: this.data.address,
    }
    this.appservice.postOrder(data).subscribe((result)=> {
      if(result.status){
        this.fromCod = false;
      }
    })
  }

}
