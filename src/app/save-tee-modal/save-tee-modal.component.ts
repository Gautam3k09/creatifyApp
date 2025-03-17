import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-save-tee-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './save-tee-modal.component.html',
    styleUrl: './save-tee-modal.component.css',
})
export class SaveTeeModalComponent {
    price: any;
    profitPrice: any;
    helper: any = false;
    constructor(
        @Inject(MAT_DIALOG_DATA)
        public data: { isMerch: any; teeName: any; finalPrice: any; fromHelper: any },
        public dialogRef: MatDialogRef<SaveTeeModalComponent>
    ) {
        this.helper = this.data.fromHelper;
    }
    ngOnInit() {
        console.log(this.data);
        this.calculatePrice();
    }

    calculatePrice() {
        this.price = 0.4 * this.data.finalPrice + 229.4;
        this.profitPrice = this.data.finalPrice - this.price;
    }

    closeModal() {
        this.dialogRef.close('close');
    }
}
