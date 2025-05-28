import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-policy-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './policy-modal.component.html',
  styleUrl: './policy-modal.component.css'
})
export class PolicyModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { dialogType: string }) { }
}
