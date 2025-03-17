import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { fabric } from 'fabric';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [HeaderPageComponent],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  canvas!: fabric.Canvas;

  @ViewChild('teeCanvas', { static: false }) teeCanvasRef!: ElementRef<HTMLCanvasElement>;
  teeCanvas!: fabric.Canvas;

  // for tee color
  imageFrontSrc = 'assets/Tees/black-f.png';
  imageFrontUrls = [
    'assets/Tees/black-f.png',
    'assets/Tees/white-f.png',
    'assets/Tees/blue-f.png',
    'assets/Tees/maroon-f.png',
  ];
  imageBackSrc = 'assets/Tees/black-b.png';
  imageBackUrls = [
    'assets/Tees/black-b.png',
    'assets/Tees/white-b.png',
    'assets/Tees/blue-b.png',
    'assets/Tees/maroon-b.png',
  ];
  imageColor: any = 'Onyx black';

  state: any[] = [];
  currentStateIndex: number = -1;
  selectedColor: string = '#000'; // Default color

  constructor() { }

  ngAfterViewInit() {
    const canvasElement = this.canvasRef.nativeElement;

    this.canvas = new fabric.Canvas(canvasElement, {
      width: 400,
      height: 500,
      backgroundColor: '#ffffff'
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

      // Ensure object doesn't go outside the design area
      const newLeft = Math.max(
        designArea.left!,
        Math.min(obj.left!, designArea.left! + designArea.width! - obj.getScaledWidth())
      );

      const newTop = Math.max(
        designArea.top!,
        Math.min(obj.top!, designArea.top! + designArea.height! - obj.getScaledHeight())
      );

      obj.set({ left: newLeft, top: newTop });
    });
    this.saveState();
  }

  loadOrUpdateTeeCanvas() {
    fabric.Image.fromURL(this.imageFrontSrc, (img) => {
      img.set({
        // selectable: false,
        scaleX: this.teeCanvas?.width! / img.width!,
        scaleY: this.teeCanvas?.height! / img.height!,
      });

      this.teeCanvas.setBackgroundImage(img, this.teeCanvas.renderAll.bind(this.teeCanvas));
    });
  }
  loadOrUpdateCanvas() { }

  // Add Text
  addText(): void {
    const text = new fabric.Textbox('Your Design Here', {
      left: 5,
      top: 5,
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
          img.scaleToWidth(50);

          img.set({
            left: 150,                // Set position
            top: 150,
            selectable: true,        // Enable dragging
            evented: true,           // Allow interactions
            hasControls: true        // Show resizing controls
          });

          this.canvas.add(img);
          this.canvas.setActiveObject(img); // Ensure image is active for movement
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
