import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as fabric from 'fabric';
import paper from 'paper';

@Component({
  selector: 'app-test-component',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [(ngModel)]="inputText"
      (input)="createTextOnCurve()"
      placeholder="Type your text"
      style="width: 100%; margin-bottom: 12px; padding: 8px"
    />
    <canvas
      #canvasEl
      width="800"
      height="400"
      style="border: 1px solid #ccc"
    ></canvas>
  `
  ,
  styleUrl: './test-component.component.css'
})
export class TestComponentComponent implements AfterViewInit {
  @ViewChild('canvasEl', { static: true }) canvasEl!: ElementRef<HTMLCanvasElement>;

  canvas!: fabric.Canvas;
  inputText = 'Fabric curved text';

  points = [
    { x: 100, y: 300 },
    { x: 400, y: 100 },
    { x: 700, y: 300 }
  ];

  handles: fabric.Circle[] = [];
  lettersGroup?: fabric.Group;

  private curvePath?: fabric.Path;

  ngAfterViewInit() {
    this.canvas = new fabric.Canvas(this.canvasEl.nativeElement, {
      selection: false,
      backgroundColor: '#fff'
    });

    this.createHandles();
    this.createTextOnCurve();
  }

  createHandles() {
    // Remove existing handles
    this.handles.forEach(h => this.canvas.remove(h));
    this.handles = [];

    this.points.forEach((pt, i) => {
      // Differentiate control point shape and style
      const isControl = i === 1;

      const handle = new fabric.Circle({
        left: pt.x,
        top: pt.y,
        radius: isControl ? 12 : 9,
        fill: isControl ? '#e74c3c' : '#3498db',  // red for control, blue for others
        stroke: '#222',
        strokeWidth: 2,
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.3)',
          blur: 5,
          offsetX: 0,
          offsetY: 2,
        }),
        originX: 'center',
        originY: 'center',
        hasBorders: false,
        hasControls: false,
        selectable: true,
        hoverCursor: 'grab',
        // Add custom property to identify handle type
        handleType: isControl ? 'control' : 'anchor',
      });

      // Scale handle slightly on hover for feedback
      handle.on('mouseover', () => {
        fabric.util.animate({
          startValue: handle.radius!,
          endValue: handle.radius! * 1.3,
          duration: 150,
          onChange: (value) => {
            handle.radius = value;
            this.canvas.requestRenderAll();
          }
        });
        handle.hoverCursor = 'grabbing';
        this.canvas.requestRenderAll();
      });

      handle.on('mouseout', () => {
        const baseRadius = isControl ? 12 : 9;
        fabric.util.animate({
          startValue: handle.radius!,
          endValue: baseRadius,
          duration: 150,
          onChange: (value) => {
            handle.radius = value;
            this.canvas.requestRenderAll();
          }
        });
        this.canvas.requestRenderAll();
      });

      handle.on('moving', () => {
        this.points[i].x = handle.left!;
        this.points[i].y = handle.top!;

        this.drawCurve();
        this.positionLettersOnCurve();

        this.canvas.requestRenderAll();
      });

      // Optional: tooltip text on hover (simple)
      handle.on('mouseover', () => {
        const tooltipText = isControl ? 'Control Point (drag to curve)' : `Anchor Point #${i + 1}`;
        this.showTooltip(tooltipText, handle.left!, handle.top!);
      });
      handle.on('mouseout', () => {
        this.hideTooltip();
      });

      this.handles.push(handle);
      this.canvas.add(handle);
    });

    this.drawCurve();
  }

  showTooltip(text: string, x: number, y: number) {
    let tooltip = document.getElementById('canvas-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.id = 'canvas-tooltip';
      tooltip.style.position = 'absolute';
      tooltip.style.padding = '4px 8px';
      tooltip.style.background = 'rgba(0,0,0,0.7)';
      tooltip.style.color = '#fff';
      tooltip.style.fontSize = '12px';
      tooltip.style.borderRadius = '4px';
      tooltip.style.pointerEvents = 'none';
      document.body.appendChild(tooltip);
    }
    tooltip.innerText = text;
    tooltip.style.left = x + 15 + 'px';  // offset right
    tooltip.style.top = y + 15 + 'px';   // offset down
    tooltip.style.display = 'block';
  }

  hideTooltip() {
    const tooltip = document.getElementById('canvas-tooltip');
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }


  drawCurve() {
    const [p0, p1, p2] = this.points;
    const pathData = `M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`;

    if (this.curvePath) {
      this.canvas.remove(this.curvePath);
    }

    this.curvePath = new fabric.Path(pathData, {
      stroke: 'transparent',  // Invisible curve
      strokeWidth: 0,
      fill: '',
      selectable: false,
      evented: false
    });

    this.canvas.add(this.curvePath);
    this.canvas.sendObjectToBack(this.curvePath);
  }

  createTextOnCurve() {
    if (this.lettersGroup) {
      this.canvas.remove(this.lettersGroup);
      this.lettersGroup = undefined;
    }

    if (!this.inputText) return;

    const letters: fabric.Text[] = [];

    for (const char of this.inputText) {
      const letter: any = new fabric.Textbox(char, {
        fontSize: 36,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        fill: '#222',
        // Added fontFamily for better visibility
        fontFamily: 'Arial, Helvetica, sans-serif',
        // Added shadow for better contrast
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.2)',
          blur: 2,
          offsetX: 1,
          offsetY: 1
        })
      });
      letters.push(letter);
    }

    this.lettersGroup = new fabric.Group(letters, {
      selectable: false,
      evented: false
    });

    this.canvas.add(this.lettersGroup);

    this.positionLettersOnCurve();
  }

  bezierPoint(t: number) {
    const [p0, p1, p2] = this.points;

    const x =
      (1 - t) * (1 - t) * p0.x +
      2 * (1 - t) * t * p1.x +
      t * t * p2.x;
    const y =
      (1 - t) * (1 - t) * p0.y +
      2 * (1 - t) * t * p1.y +
      t * t * p2.y;

    return { x, y };
  }

  bezierTangent(t: number) {
    const [p0, p1, p2] = this.points;

    const x =
      2 * (1 - t) * (p1.x - p0.x) +
      2 * t * (p2.x - p1.x);
    const y =
      2 * (1 - t) * (p1.y - p0.y) +
      2 * t * (p2.y - p1.y);

    return { x, y };
  }

  positionLettersOnCurve() {
    if (!this.lettersGroup) return;

    const letters = this.lettersGroup._objects as fabric.Text[];
    const count = letters.length;

    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count;

      const point = this.bezierPoint(t);
      const tangent = this.bezierTangent(t);

      const angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;

      letters[i].set({
        left: point.x,
        top: point.y,
        angle: angle,
      });
      letters[i].setCoords();
    }

    this.lettersGroup.setCoords();
    this.canvas.requestRenderAll();
  }
}
