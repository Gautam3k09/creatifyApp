import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-placed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.css'
})
export class OrderPlacedComponent {
  fromCod = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {from: any,buyPageData:any,userData:any},public dialogRef: MatDialogRef<OrderPlacedComponent> ) { }
  ngOnInit(){

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

}
