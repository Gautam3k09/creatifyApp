import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-create-page-modal',
  standalone: true,
  imports: [MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, CommonModule],
  templateUrl: './create-page-modal.component.html',
  styleUrl: './create-page-modal.component.css'
})
export class CreatePageModalComponent {
  @ViewChild('imageInput') imageInput!: ElementRef;

  tshirtName: any = '';
  shirtPrice = 799;
  termsAccepted = false;
  constructor(
    private dialogRef: MatDialogRef<CreatePageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { dialogType: string, userType: string }
  ) {

  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave(event: any = '') {
    let result;
    if (this.data.dialogType == 'save') {
      result = {
        name: this.tshirtName.replace(/^\s+/, ''),
        price: this.shirtPrice
      };
    }
    if (this.data.dialogType == 'add') {
      result = event
    }
    this.dialogRef.close(result);
  }

  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }


}
