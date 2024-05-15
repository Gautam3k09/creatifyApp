import { Component } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';

@Component({
  selector: 'app-store',
  standalone: true,
  imports: [HeaderPageComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css'
})
export class StoreComponent {

}
