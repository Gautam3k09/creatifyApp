import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanvasAreaComponent } from '../canvas-area/canvas-area.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private dialog: MatDialog) {}

  openModal(): void {
    this.dialog.open(CanvasAreaComponent, {
      width: '100%',
      height: '100%',
      panelClass: 'full-screen-modal-dialog'
    });
  }
}
