import { Component } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event'

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent {
  width: any;
  height: any;

  onResized(event: any): void {
    this.width = event.newRect.width;
    this.height = event.newRect.height;
  }


  private isDragging = false;
  private isClicking = false;
  private offsetX = 0;
  private offsetY = 0;

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.offsetX = event.clientX;
    this.offsetY = event.clientY;
    this.isClicking = true;
  }

  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const deltaX = event.clientX - this.offsetX;
      const deltaY = event.clientY - this.offsetY;
      const element : any = document.getElementById('draggable');
      const rect = element.getBoundingClientRect();
      const newX = rect.left + deltaX;
      const newY = rect.top + deltaY;
      element.style.left = newX + 'px';
      element.style.top = newY + 'px';
      this.offsetX = event.clientX;
      this.offsetY = event.clientY;
      // If the mouse moves, it's considered dragging, not clicking
      this.isClicking = false;
    }
  }

  onMouseUp() {
    this.isDragging = false;
    if (this.isClicking) {
      // If the mouse was not moved during mousedown-mouseup, it's considered a click
      console.log('Image clicked!');
    }
  }
}
