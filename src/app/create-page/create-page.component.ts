import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { fabric } from 'fabric';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [HeaderPageComponent, CommonModule, ColorPickerModule, FormsModule],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('itemListRef', { static: true }) itemListRef!: ElementRef<HTMLUListElement>;
  canvas!: fabric.Canvas;
  canvasData1: string | null = null;
  canvasData2: string | null = null;
  isCanvas1Visible = true;
  canvas1ItemList: any = [];
  canvas2ItemList: any = [];
  itemList: any = [];
  selectedText: fabric.Textbox | null = null;
  selectedTextColor: string = '#000000'; // Default color
  selectedFont: string = 'Oswald';  // Default font
  isBold: boolean = false;

  fontList: string[] = [
    'Arial', 'Oswald', 'Merriweather', 'Courier New', 'Georgia', 'Impact', 'Times New Roman', 'Verdana', 'Bebas Neue', 'Anton', 'Montserrat', 'Poppins', 'Pacifico', 'Lobster', 'Righteous', 'Permanent Marker', 'Rock Salt', 'Indie Flower'
  ];

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
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 230,
      height: 299,
      backgroundColor: 'transparent'
    });

    //for canvas margin
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const upperCanvas = canvasElement.nextElementSibling as HTMLCanvasElement; // Overlay canvas
    upperCanvas.style.left = 63 + '%';
    upperCanvas.style.top = 42 + '%';

    this.saveState();
    this.initializeCanvas1();

    // Track text changes in real-time
    this.canvas.on('text:changed', (event) => {
      const obj: any = event.target as fabric.Textbox;
      if (obj) {
        console.log(obj)
        this.updateTextName(obj.id, obj.text);
      }
    });

    // Highlight selected object
    this.canvas.on('selection:created', (event) => {
      const selectedObj = event.selected?.[0];
      if (selectedObj) {
        this.highlightSelectedItem(selectedObj);
      }
    });

    // Initialize SortableJS for drag-and-drop reordering
    this.initSortable();

    fabric.Object.prototype.objectCaching = false;

    // Track selected text
    this.canvas.on('selection:created', (event) => {
      const activeObject = this.canvas.getActiveObject();
      if (activeObject && activeObject.type === 'textbox') {
        this.selectedText = activeObject as fabric.Textbox;
        this.selectedTextColor = this.selectedText.fill as string;
      } else {
        this.selectedText = null;
      }
    });

    this.canvas.on('selection:cleared', () => {
      this.selectedText = null;
    });

    this.canvas.on('object:modified', () => {
      this.canvas.renderAll();
    });

    // Track selected text
    this.canvas.on('selection:created', () => this.checkSelectedObject());
    this.canvas.on('selection:updated', () => this.checkSelectedObject());
    this.canvas.on('selection:cleared', () => this.selectedText = null);
  }

  initializeCanvas1() {
    this.canvas.clear();
    this.canvasData1 = JSON.stringify(this.canvas.toJSON());
  }

  initializeCanvas2() {
    this.canvas.clear();
    this.canvasData2 = JSON.stringify(this.canvas.toJSON());
  }

  reapplyObjectStyles(): void {
    this.canvas.getObjects().forEach((obj) => {
      obj.set({
        borderColor: '#000',
        cornerColor: '#333',
        cornerSize: 10,
        transparentCorners: false,
        selectionBackgroundColor: 'rgba(0, 0, 0, 0.3)'
      });
    });
    this.canvas.renderAll();
  }

  toggleCanvas() {
    this.saveState(); // Save current state before switching
    this.canvas.clear();

    if (this.isCanvas1Visible) {
      if (this.canvasData2) {
        this.canvas.loadFromJSON(this.canvasData2, () => {
          this.reapplyObjectStyles();
          this.canvas.renderAll();
        });
      } else {
        this.initializeCanvas2();
      }
      this.canvas1ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas2ItemList;
    } else {
      if (this.canvasData1) {
        this.canvas.loadFromJSON(this.canvasData1, () => {
          this.reapplyObjectStyles();
          this.canvas.renderAll();
        });
      } else {
        this.initializeCanvas1();
      }
      this.canvas2ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas1ItemList;
    }
    this.isCanvas1Visible = !this.isCanvas1Visible;
  }

  saveState() {
    if (this.isCanvas1Visible) {
      this.canvasData1 = JSON.stringify(this.canvas.toJSON(['selectable', 'angle', 'scaleX', 'scaleY', 'top', 'left', 'id', 'type', 'name', 'visibility']));
    } else {
      this.canvasData2 = JSON.stringify(this.canvas.toJSON(['selectable', 'angle', 'scaleX', 'scaleY', 'top', 'left', 'id', 'type', 'name', 'visibility']));
    }
  }

  // Add Text
  addText(): void {
    const uniqueId = 'item_' + Date.now();
    const text = new fabric.Textbox('Text', {
      left: 15,
      top: 5,
      fontSize: 30,
      fill: this.selectedColor,
      fontFamily: 'Oswald',
      editable: true,
      borderColor: '#000',         // Darker border for selected object
      cornerColor: '#333',         // Dark corner controls
      cornerSize: 10,              // Enlarged corner size for visibility
      transparentCorners: false,   // Solid corners for better control
      selectionBackgroundColor: 'rgba(0, 0, 0, 0.3)'
    });
    (text as any).id = uniqueId;
    this.canvas.add(text);
    this.canvas.setActiveObject(text);
    this.canvas.renderAll();
    // this.saveState();
    this.itemList.unshift({ id: uniqueId, type: 'text', name: 'Text', visible: true });
  }

  updateTextName(itemId: string, newText: string): void {
    const item = this.itemList.find((item: any) => item.id === itemId);
    console.log(item, itemId)
    if (item) {
      item.name = newText;
    }
  }

  changeTextColor(color: string): void {
    if (this.selectedText) {
      this.selectedText.set('fill', color);
      this.canvas.renderAll();
    }
  }

  checkSelectedObject(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'textbox') {
      this.selectedText = activeObject as fabric.Textbox;
      this.selectedFont = this.selectedText.fontFamily || 'Oswald';
      this.isBold = this.selectedText.fontWeight === 'bold';
    } else {
      this.selectedText = null;
    }
  }

  changeFont(font: string): void {
    if (this.selectedText) {
      this.selectedText.set({ fontFamily: font });
      this.canvas.renderAll();
    }
  }

  toggleBold(): void {
    if (this.selectedText) {
      this.isBold = !this.isBold;
      this.selectedText.set({
        fontWeight: this.isBold ? 'bold' : 'normal'
      });
      this.canvas.renderAll();
    }
  }

  // Add Image
  addImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      fabric.Image.fromURL(e.target.result, (img: any) => {
        img.scaleToWidth(200);
        const uniqueId = 'item_' + Date.now();
        img.set({
          id: uniqueId,
          left: 15,
          top: 5,
          selectable: true,
          hasControls: true,
          borderColor: '#000',         // Darker border for selected object
          cornerColor: '#333',         // Dark corner controls
          cornerSize: 10,              // Enlarged corner size for visibility
          transparentCorners: false,   // Solid corners for better control
          selectionBackgroundColor: 'rgba(0, 0, 0, 0.3)'
        });

        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.canvas.renderAll();
        // this.saveState()
        this.itemList.unshift({ id: uniqueId, type: 'image', name: file.name, visible: true });
      });
    };
    reader.readAsDataURL(file);
  }

  selectItem(itemId: string): void {
    const objects = this.canvas.getObjects();
    const target = objects.find((obj: any) => obj.id === itemId);

    if (target) {
      this.canvas.setActiveObject(target);
      this.canvas.renderAll();
    }
  }

  highlightSelectedItem(selectedObj: any): void {
    const selectedId = selectedObj.id;
    const items = document.querySelectorAll('.item-list li');
    items.forEach((item) => {
      if (item.getAttribute('data-id') === selectedId) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  toggleVisibility(itemId: string): void {
    const target = this.canvas.getObjects().find((obj: any) => obj.id === itemId);
    const item = this.itemList.find((item: any) => item.id === itemId);

    if (target && item) {
      target.set('visible', !target.visible);
      item.visible = target.visible;
      this.canvas.renderAll();
    }
  }

  deleteItem(itemId: string): void {
    const target = this.canvas.getObjects().find((obj: any) => obj.id === itemId);

    if (target) {
      this.canvas.remove(target);
      this.itemList = this.itemList.filter((item: any) => item.id !== itemId);
      this.canvas.renderAll();
    }
  }

  initSortable(): void {
    Sortable.create(this.itemListRef.nativeElement, {
      animation: 150,
      onEnd: (event) => {
        const movedItem = this.itemList.splice(event.oldIndex!, 1)[0];
        this.itemList.splice(event.newIndex!, 0, movedItem);

        // Correctly reorder canvas objects
        this.reorderCanvasObjects();
      }
    });
  }

  reorderCanvasObjects(): void {
    const objects = this.canvas.getObjects();

    // Clear canvas and re-add items in the correct order (reverse order for proper layering)
    this.canvas.clear();

    [...this.itemList].reverse().forEach((item) => {
      const target = objects.find((obj: any) => obj.id === item.id);
      if (target) {
        this.canvas.add(target);
      }
    });

    this.canvas.renderAll();
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
