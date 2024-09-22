import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-placed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-placed.component.html',
  styleUrl: './order-placed.component.css'
})
export class OrderPlacedComponent {
  fromCod = true;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {from: any,message:any,for:any ,input : any}) { }
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

}
