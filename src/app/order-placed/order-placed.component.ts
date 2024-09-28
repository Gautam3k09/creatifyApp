import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppServiceService } from '../app-service.service';
import { localStorageService } from '../local-storage-service';

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
  storeData : any;
  constructor(private router: Router,@Inject(MAT_DIALOG_DATA) public data: {from: any,buyPageData:any,userData:any,finalPrice:any,address:any},public dialogRef: MatDialogRef<OrderPlacedComponent> , private appservice : AppServiceService,private localStorage: localStorageService) { 
    this.storeData = this.localStorage.getUserLocalStorage();
  }

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
    if(this.storeData.visitor == null) {
      this.closeModal('shop');
      this.router.navigate(['/shop']);
    } else {
      this.closeModal('shop');
      this.router.navigate(['/'+ this.storeData.visitor + '/merch/' + this.data.buyPageData.user_Id ]);
    }
  }

  placeOrder(){
    let data = {
      tshirtId : this.data.buyPageData._id,
      by:  this.storeData.visitor == null ?this.data.userData.user_Name : this.data.userData.phoneNumber,
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
