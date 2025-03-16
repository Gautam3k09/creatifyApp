import { CommonModule } from '@angular/common';
import { Component, OnInit,  } from '@angular/core';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule,
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent implements OnInit {

  ngOnInit(): void {
  }

}
