import { Component, ElementRef, ViewChild, AfterViewInit  } from '@angular/core';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [
  ],
  templateUrl: './test-page.component.html',
  styleUrl: './test-page.component.css'
})
export class TestPageComponent implements AfterViewInit {
  @ViewChild('myCanvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false }) fileInputRef!: ElementRef<HTMLInputElement>;
  @ViewChild('secondaryCanvas', { static: false }) secondaryCanvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private secondaryCtx!: CanvasRenderingContext2D;
  private currentX = 0; // X-coordinate to draw images
  private currentY = 0; // Y-coordinate to draw images
  private imageSpacing = 10; // Spacing between images
  private maxFileSizeMB = 5; // Max file size in MB

  ngAfterViewInit(): void {
    // const canvas = this.canvasRef.nativeElement;
    // this.ctx = canvas.getContext('2d')!;
    
    // // Set canvas size (adjust as needed)
    // canvas.width = 1800;
    // canvas.height = 600;
    this.drawImageOnCanvas();
    const mainCanvas = this.canvasRef.nativeElement;
    const secondaryCanvas = this.secondaryCanvasRef.nativeElement;
    mainCanvas.width = 800;
    mainCanvas.height = 600;
    secondaryCanvas.width = 200;
    secondaryCanvas.height = 200;
    this.ctx = mainCanvas.getContext('2d')!;
    this.secondaryCtx = secondaryCanvas.getContext('2d')!;

    // Draw something on the secondary canvas
    this.drawOnSecondaryCanvas();
  }

  drawOnSecondaryCanvas(): void {
    const ctx = this.secondaryCtx;

    // Fill the secondary canvas with a background color
    ctx.fillStyle = 'lightblue';
    ctx.fillRect(0, 0, 200, 200);

    // Add some text or graphics
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.fillText('Secondary Canvas', 40, 100);
  }

  drawCanvasInsideCanvas(): void {
    const mainCanvas = this.canvasRef.nativeElement;
    const secondaryCanvas = this.secondaryCanvasRef.nativeElement;

    // Draw the secondary canvas onto the main canvas
    this.ctx.drawImage(secondaryCanvas, 50, 50, 200, 200);
  }

  drawImageOnCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Set canvas size
      canvas.width = 1800; // You can adjust the width
      canvas.height = 800; // You can adjust the height

      // Create a new image
      const img = new Image();
      img.src = 'assets/tshirts/black-f.png'; // Path to your image file (place it in the `assets` folder)

      img.onload = () => {
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      img.onerror = () => {
        console.error('Failed to load the image.');
      };
    } else {
      console.error('Canvas context not found!');
    }
  }
  addImages(): void {
    const inputElement = this.fileInputRef.nativeElement;
    const files = inputElement.files;
    if (!files || files.length === 0) {
      console.warn('No files selected.');
      return;
    }
    Array.from(files).forEach((file) => {
      if (file.size > this.maxFileSizeMB * 1024 * 1024) {
        console.warn(`File "${file.name}" exceeds the 5 MB size limit.`);
        return;
      }
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          this.drawImage(img);
        };
      };

      reader.onerror = () => {
        console.error('Error reading file:', file.name);
      };

      reader.readAsDataURL(file);
    });
  }
  private drawImage(image: HTMLImageElement): void {
    const canvas = this.canvasRef.nativeElement;

    // Check if image fits horizontally, otherwise move to the next row
    if (this.currentX + image.width > canvas.width) {
      this.currentX = 10; // Reset X-coordinate
      this.currentY += image.height + this.imageSpacing; // Move to the next row
    }

    // Check if image fits vertically, otherwise stop drawing
    // if (this.currentY + image.height > canvas.height) {
    //   console.warn('Canvas is full, cannot add more images.');
    //   return;
    // }

    // Draw the image on the canvas
    this.ctx.drawImage(image, this.currentX, this.currentY);

    // Update X-coordinate for the next image
    this.currentX += image.width + this.imageSpacing;
  }

}
