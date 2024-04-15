import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDraggable]'
})
export class DraggableDirective {
  private isDragging = false;
  private startX: number = 0;
  private startY: number = 0;
  private offsetX: number = 0;
  private offsetY: number = 0;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.startX = event.clientX - this.offsetX;
    this.startY = event.clientY - this.offsetY;
  }

  @HostListener('document:mouseup')
  onMouseUp() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) {
      return;
    }
    const offsetX = event.clientX - this.startX;
    const offsetY = event.clientY - this.startY;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translate(${offsetX}px, ${offsetY}px)`);
  }
}