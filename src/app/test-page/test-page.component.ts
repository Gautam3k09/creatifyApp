import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { ColorSketchModule } from 'ngx-color/sketch';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, ColorSketchModule],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css',
})
export class TestPageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;

  imageFrontSrc = 'assets/Tees/black-f.png';
  // Undo/Redo Stack
  state: any[] = [];
  currentStateIndex: number = -1;
  selectedColor: string = '#000'; // Default color

  ngAfterViewInit() {
    const canvasElement = this.canvasRef.nativeElement;

    this.canvas = new fabric.Canvas(canvasElement, {
      width: canvasElement.clientWidth,
      height: canvasElement.clientHeight,
    });

    // Add T-shirt Background
    fabric.Image.fromURL(this.imageFrontSrc, (img) => {
      img.set({
        selectable: false, // Prevent interaction with T-shirt
        evented: false, // Disable Fabric.js controls for background
        scaleX: this.canvas.width! / img.width!,
        scaleY: this.canvas.height! / img.height!,
      });
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
    });

    // Add Design Area (Center Part)
    const designArea = new fabric.Rect({
      left: this.canvas.width! * 0.25, // Center alignment
      top: this.canvas.height! * 0.3, // Positioned in the middle
      width: this.canvas.width! * 0.5, // Design area width
      height: this.canvas.height! * 0.4, // Design area height
      fill: 'transparent',
      stroke: '#007bff', // Design area border
      strokeWidth: 2,
      selectable: false, // Prevent accidental moves
      evented: false,
    });

    this.canvas.add(designArea);

    this.canvas.on('object:moving', (e) => {
      const obj: any = e.target;
      obj.set({
        left: Math.max(
          designArea.left!,
          Math.min(obj.left!, designArea.left! + designArea.width! - obj.width!)
        ),
        top: Math.max(
          designArea.top!,
          Math.min(obj.top!, designArea.top! + designArea.height! - obj.height!)
        ),
      });
    });
    this.saveState();
  }

  // Load T-shirt mockup
  loadTshirtMockup(): void {
    fabric.Image.fromURL('assets/images/tshirt-template.png', (img) => {
      img.set({
        selectable: false,
        left: 0,
        top: 0,
        scaleX: this.canvas.width! / img.width!,
        scaleY: this.canvas.height! / img.height!,
      });

      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
      this.saveState();
    });
  }

  // Add Text
  addText(): void {
    const text = new fabric.Textbox('Your Design Here', {
      left: 100,
      top: 200,
      fontSize: 30,
      fill: this.selectedColor,
      fontFamily: 'Oswald',
      editable: true,
    });

    this.canvas.add(text);
    this.canvas.renderAll();
    this.saveState();
  }

  // Add Image
  addImage(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        fabric.Image.fromURL(e.target.result, (img) => {
          img.scaleToWidth(200);
          img.set({ left: 100, top: 150 });
          this.canvas.add(img);
          this.canvas.renderAll();
          this.saveState();
        });
      };
      reader.readAsDataURL(file);
    }
  }

  // Update Color for Selected Element
  updateColor(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      if (activeObject instanceof fabric.Textbox) {
        activeObject.set({ fill: this.selectedColor });
      } else if (activeObject instanceof fabric.Image) {
        if (!activeObject.filters) {
          activeObject.filters = [];
        }
        activeObject.filters.push(
          new fabric.Image.filters.Tint({ color: this.selectedColor })
        );
        activeObject.applyFilters();
      }
      this.canvas.renderAll();
      this.saveState();
    }
  }

  // Undo Function
  undo(): void {
    if (this.currentStateIndex > 0) {
      this.currentStateIndex--;
      this.canvas.loadFromJSON(
        this.state[this.currentStateIndex],
        this.canvas.renderAll.bind(this.canvas)
      );
    }
  }

  // Redo Function
  redo(): void {
    if (this.currentStateIndex < this.state.length - 1) {
      this.currentStateIndex++;
      this.canvas.loadFromJSON(
        this.state[this.currentStateIndex],
        this.canvas.renderAll.bind(this.canvas)
      );
    }
  }

  // Save Canvas State for Undo/Redo
  saveState(): void {
    const json = this.canvas.toJSON();
    this.state = this.state.slice(0, this.currentStateIndex + 1);
    this.state.push(json);
    this.currentStateIndex = this.state.length - 1;
  }

  // Download Design as PNG
  downloadImage(): void {
    const scaleFactor = 5;
    const dataURL = this.canvas.toDataURL({
      format: 'png',
      multiplier: scaleFactor,
      quality: 1.0,
    });

    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'tshirt-design.png';
    link.click();
  }

  // Save Design to Database (Mock Example)
  saveDesign(): void {
    const designData = this.canvas.toJSON();
    console.log('Saved Design:', designData);

    // Mock API Call Example
    // this.http.post('/api/save-design', { design: designData }).subscribe(res => {
    //   console.log('Design saved successfully!');
    // });
  }
}
