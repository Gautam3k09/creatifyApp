import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
// import { CanvasAreaComponent } from '../canvas-area/canvas-area.component';
import { HeaderPageComponent } from '../header-page/header-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private dialog: MatDialog) {}

}
