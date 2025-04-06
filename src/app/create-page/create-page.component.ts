import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { localStorageService } from '../local-storage-service';
import * as fabric from 'fabric';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { titleTextTemplates, bodyTextTemplates } from '../../assets/text-template';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, ColorPickerModule, FormsModule],
  providers: [AppServiceService],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('itemListRef', { static: false }) itemListRef!: ElementRef<HTMLUListElement>;
  @ViewChildren('templateCanvas') templateCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChild('imageInput') imageInput!: ElementRef;
  canvas!: fabric.Canvas;
  canvasData1: any = null;
  canvasData2: any | null = null;
  isCanvas1Visible = true;
  canvas1ItemList: any = [];
  canvas2ItemList: any = [];
  itemList: any = [];
  activePanel: string = 'Properties';
  tshirtName: string = '';
  showAddElementModal: boolean = false;

  // text
  selectedText: any;
  text: any = '';
  textfont: string = 'Oswald';  // Default font
  textcolor: string = '#0056b3'; // Default color
  isBold: boolean = false;
  hasFill: boolean = true;
  fontSize: number = 24;
  shadowEnabled: boolean = false;
  shadowOffsetX: number = 0;
  shadowOffsetY: number = 0;
  shadowBlur: number = 60;
  shadowColor: string = '#000000';
  opacity: number = 1;
  rotate: number = 0;
  lineHeight = 0;
  charSpacing = 0;
  isArcEnabled = false;
  arcAmount = 0;
  selectedCurve = 'arc';
  isTextStrokeEnabled = false;
  textStrokeSize = 0;
  strokeColor: string = '#9d9d9d';

  textStyles = {
    uppercase: false,
    italic: false,
    bold: false,
    underline: false
  };
  fontList: string[] = [
    'CinemaGroovy', 'DesignerThickers', 'NightRumble', 'RetroImpact', 'SnakeheadGraffiti', 'ComicZine', 'Flipped', 'NaishilaDancingScript', 'Oswald', 'Ryzes', 'SpookyStories', 'CooperBlack',
    'DASHER', 'GEMSEAtrial', 'NekoNeco', 'Supernova', 'NCLBroesq', 'StarKillers'
  ];
  textTemplates: any = [];
  titletexttemplates = titleTextTemplates;
  bodytexttemplates = bodyTextTemplates;


  // for image
  selectedImage: any;
  imgBrightness: any;
  imgContrast: any;
  imgSaturation: any;
  imgHue: any;
  imgBlur: any = 0;
  imgNoise: any = 0;

  // for tee color
  imageFrontSrc = 'assets/Tees/white-f.png';
  imageFrontUrls = [
    'assets/Tees/black-f.png',
    'assets/Tees/white-f.png',
    'assets/Tees/blue-f.png',
    'assets/Tees/maroon-f.png',
  ];
  imageBackSrc = 'assets/Tees/white-b.png';
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

  userData: any;
  priceRange: any = 549;
  designName: any = 'Trial-Tee';
  formDataFront = new FormData();
  formDataBack = new FormData();
  frontImgName: any;
  BackImgName: any;

  constructor(
    private appservice: AppServiceService,
    public localStorage: localStorageService,
    private router: Router,) {

    this.userData = this.localStorage.getUserLocalStorage();
    this.userData = JSON.parse(this.userData.userData);
  }

  ngAfterViewInit() {
    fabric.Object.prototype.objectCaching = false;
    this.textTemplates = [...this.titletexttemplates, ...this.bodytexttemplates];
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 195,
      height: 250,
      backgroundColor: 'transparent'
    });

    //for canvas margin
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const upperCanvas = canvasElement.nextElementSibling as HTMLCanvasElement; // Overlay canvas
    upperCanvas.style.left = 50.2 + '%';
    upperCanvas.style.top = 64 + '%';
    this.saveState();

    // Track text changes in real-time
    this.canvas.on('text:changed', (event) => {
      const obj: any = event.target as fabric.Textbox;
      if (obj) {
        this.updateTextName(obj.id, obj.text);
      }
    });

    this.initSortable();



    // Track selected text
    this.canvas.on('selection:created', (event: any) => {
      if (event.selected.length > 1) return;
      this.checkSelectedObject()
    });

    this.canvas.on('object:modified', () => {
      this.checkSelectedObject();
      // this.updateAngleValue();
      this.canvas.renderAll();
    });

    // Track selected text
    this.canvas.on('selection:updated', () => {
      this.checkSelectedObject();
    });
    this.canvas.on('selection:cleared', () => {
      this.selectedText = null
      this.selectedImage = null;
      this.togglePanel('Properties');
    });
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
        borderColor: '#0056b3',
        cornerColor: '#0056b3',
        cornerSize: 10,
        transparentCorners: false,
        selectionBackgroundColor: 'rgba(129, 129, 129, 0.3)'
      });
      obj.setCoords();
    });
    this.canvas.renderAll();
  }

  toggleCanvas() {
    this.saveState(); // Save current state before switching
    this.canvas.clear();
    const canvasContainer = document.querySelector('.canvas-containers') as HTMLElement;

    if (this.isCanvas1Visible) {
      if (this.canvasData2) {
        this.canvas.loadFromJSON(this.canvasData2, () => {
          this.canvas.getObjects().forEach(obj => {
            if (obj.type === "texttemplate") {
              obj.set({ type: "textbox" }); // Convert to valid type
            }
          });
          this.canvas.renderAll();
        });

      } else {
        this.initializeCanvas2();
      }
      this.canvas1ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas2ItemList;
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageBackSrc})`;
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
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageFrontSrc})`;
    }
    this.isCanvas1Visible = !this.isCanvas1Visible;
  }

  saveState() {
    if (this.isCanvas1Visible) {
      this.canvasData1 = JSON.stringify(this.canvas.toJSON());
    } else {
      this.canvasData2 = JSON.stringify(this.canvas.toJSON());
    }
  }

  openElementModal() {
    this.showAddElementModal = !this.showAddElementModal;
  }
  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }

  // Add Text
  addText(targetCanvas: any, text: string = '', templateId: string = ''): void {
    const uniqueId = 'item_' + Date.now();

    let elements = [];
    if (templateId) {
      const template = this.textTemplates.find((t: any) => t.id === templateId);
      if (!template) return;

      elements = template.elements.map((element: any, index: any) => ({
        ...element,
        // id: `${templateId}_text_${index}`,
        selectable: targetCanvas === this.canvas,
        evented: targetCanvas === this.canvas,
      }));
    } else {
      elements = [
        {
          text: text,
          left: 62,
          top: 90,
          fontSize: 40,
          fill: 'black',
          fontFamily: 'Oswald',
          selectable: targetCanvas === this.canvas,
          evented: targetCanvas === this.canvas,
          type: 'text'
        },
      ];
    }

    elements.forEach((el: any, i: any) => {
      if (el.type === 'rect') {
        const rectObject = new fabric.Rect({
          ...el,
          left: el.left ? el.left : 0,
          top: el.top ? el.top : 0,
          fill: el.fill ? el.fill : '',
          id: uniqueId,
        });
        if (targetCanvas == this.canvas) {

          this.itemList.unshift({ id: el.id, type: 'shape', name: el.text, visible: true });
        }
        targetCanvas.add(rectObject);
        if (targetCanvas == this.canvas) targetCanvas.setActiveObject(rectObject);
      } else {
        const textObject = new fabric.IText(el.text, {
          ...el,
          left: el.left ? el.left : 0,
          top: el.top ? el.top : 0,
          id: uniqueId + "_" + i,
        });

        if (el.effect === 'gradient') {
          textObject.set('fill', new fabric.Gradient({
            type: 'linear',
            coords: { x1: 0, y1: 0, x2: 0, y2: textObject.height! },
            colorStops: [
              { offset: 0, color: 'red' },
              { offset: 1, color: 'yellow' },
            ],
          }));
        }
        if (el.effect === 'blockbuster') {
          if (el.text === 'BLOCK') {
            textObject.set({
              skewX: -10, // Adjust skew for perspective
            });
          } else if (el.text === 'BUSTER') {
            textObject.set({
              skewX: -10, // Adjust skew for perspective
              scaleX: 1.1, // Make the bottom slightly wider
            });
          }
          textObject.set({
            fontFamily: 'Impact, sans-serif',
            fontWeight: 'bold',
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 2,
            shadow: '3px 3px 5px rgba(0, 0, 0, 0.5)',
          })
        }
        if (el.pattern && el.pattern.type === 'horizontal_stripes') {
          const patternCanvas = document.createElement('canvas');
          const ctx: any = patternCanvas.getContext('2d');
          const stripeHeight = el.pattern.stripeHeight;
          const stripeSpacing = el.pattern.stripeSpacing;
          const stripeColor = el.pattern.stripeColor;
          const backgroundColor = el.pattern.backgroundColor;

          patternCanvas.width = 1;
          patternCanvas.height = stripeHeight + stripeSpacing;

          ctx.fillStyle = stripeColor;
          ctx.fillRect(0, 0, 1, stripeHeight);

          ctx.fillStyle = backgroundColor;
          ctx.fillRect(0, stripeHeight, 1, stripeSpacing);

          const pattern = ctx.createPattern(patternCanvas, 'repeat');
          textObject.set('fill', pattern);
        }
        if (this.canvas === targetCanvas) {
          this.itemList.unshift({ id: uniqueId + "_" + i, type: 'texttemplate', name: el.text, visible: true });
        }
        targetCanvas.add(textObject);
        if (targetCanvas == this.canvas && text) targetCanvas.setActiveObject(textObject);
      }
    });
    this.reapplyObjectStyles();
    this.saveState()
    targetCanvas.renderAll();
  }

  updateTextName(itemId: string, newText: string): void {
    const item = this.itemList.find((item: any) => item.id === itemId);
    if (item) {
      item.name = newText;
    }
    this.text = newText;
  }

  changeTextColor(color: string): void {
    if (this.selectedText) {
      this.selectedText.set('fill', color);
      this.canvas.renderAll();
    }
  }

  changeFont(font: string): void {
    if (this.selectedText) {
      this.selectedText.set({ fontFamily: font });
      this.canvas.renderAll();
    }
  }

  updateFontSize(event: Event) {
    const target = event.target as HTMLInputElement;
    this.fontSize = Number(target.value);
    if (this.selectedText) {
      this.selectedText.set({
        fontSize: this.fontSize
      });
      this.canvas.renderAll();
    }
  }

  updateTextStroke(event: any = null, stroke: any = null) {
    if (event) {
      const target = event.target as HTMLInputElement;
      this.textStrokeSize = Number(target.value);
    }
    if (stroke) {
      this.strokeColor = stroke
    }
    if (this.selectedText) {
      this.selectedText.set({
        strokeWidth: event ? this.textStrokeSize / 20 : this.textStrokeSize / 20,
        stroke: stroke ? stroke : 'red'
      });
      this.canvas.renderAll();
    }
  }

  resetTextStroke() {
    if (this.isTextStrokeEnabled) {
      if (this.selectedText) {
        this.selectedText.set({
          strokeWidth: 0,
          stroke: 'none'
        });
        this.canvas.renderAll();
        this.isTextStrokeEnabled = false;
      }
    } else {
      this.isTextStrokeEnabled = true;
      this.updateTextStroke(null, this.strokeColor)
    }
  }

  updateTextShadow(type: string = '', color: any = null, event: any = null) {
    let data: any = {
      color: color || this.shadowColor,
      blur: this.shadowBlur / 10,
      offsetX: this.shadowOffsetX,
      offsetY: this.shadowOffsetY
    };

    if (event) {
      const value = parseFloat(event.target.value);

      if (type === 'blur') {
        this.shadowBlur = value;
        data.blur = this.shadowBlur / 10; // Keep blur scaled
      } else if (type === 'x') {
        this.shadowOffsetX = value;
        data.offsetX = this.shadowOffsetX;
      } else if (type === 'y') {
        this.shadowOffsetY = value;
        data.offsetY = this.shadowOffsetY;
      }
    }

    if (this.selectedText) {
      this.selectedText.set({ shadow: data });
      this.canvas.renderAll();
    }
  }

  resetTexShadow() {
    if (this.shadowEnabled) {
      if (this.selectedText && this.selectedText.type === 'text') {
        this.selectedText.set({
          shadow: null // Removes the shadow completely
        });

        this.canvas.renderAll();
      }
      this.shadowEnabled = false;
    } else {
      this.shadowEnabled = true;
      this.updateTextShadow('all', this.shadowColor, null)
    }
  }

  updateOpacity(event: Event) {
    const target = event.target as HTMLInputElement;
    this.opacity = Number(target.value);
    if (this.selectedText) {
      this.selectedText.set({
        opacity: this.opacity / 100
      });
      this.canvas.renderAll();
    }
  }

  updateAngle(event: Event) {
    const target = event.target as HTMLInputElement;
    this.rotate = Number(target.value);
    if (this.selectedText) {
      const center = this.selectedText.getCenterPoint();
      this.selectedText.set({
        angle: this.rotate,
        left: center.x,
        top: center.y,
        originX: 'center',
        originY: 'center',
      });
      this.selectedText.setCoords();
      this.canvas.renderAll();
    }
  }

  updateAngleValue() {
    if (this.selectedText) {
      this.rotate = Math.round(this.selectedText.angle);
    }
  }

  updateText(event: Event) {
    const target = event.target as HTMLInputElement;
    this.text = target.value;
    if (this.selectedText) {
      this.itemList = this.itemList.map((item: any) =>
        item.id === this.selectedText.id ? { ...item, name: this.text } : item
      );
      this.selectedText.set({
        text: this.text
      });
      this.canvas.renderAll();
    }
  }

  updateLineHeight(event: any) {
    const target = event.target as HTMLInputElement;
    this.lineHeight = Number(target.value);
    if (this.selectedText) {
      this.selectedText.set({
        lineHeight: this.lineHeight / 100
      });
      this.canvas.renderAll();
    }
  }

  updateCharSpacing(event: any) {
    const target = event.target as HTMLInputElement;
    this.charSpacing = Number(target.value);
    if (this.selectedText) {
      this.selectedText.set({
        charSpacing: this.charSpacing
      });
      this.canvas.renderAll();
    }
  }

  toggleTextStyle(style: string) {
    if (this.selectedText && this.selectedText.type === "text") {
      switch (style) {
        case 'uppercase':
          this.textStyles.uppercase = !this.textStyles.uppercase;
          this.selectedText.set("text", this.textStyles.uppercase ? this.selectedText.text.toUpperCase() : this.selectedText.text.toLowerCase());
          break;
        case 'italic':
          this.textStyles.italic = !this.textStyles.italic;
          this.selectedText.set("fontStyle", this.textStyles.italic ? "italic" : "normal");
          break;
        case 'bold':
          this.textStyles.bold = !this.textStyles.bold;
          this.selectedText.set("fontWeight", this.textStyles.bold ? "bold" : "normal");
          break;
        case 'underline':
          this.textStyles.underline = !this.textStyles.underline;
          this.selectedText.set("underline", this.textStyles.underline);
          break;
      }
      this.canvas.renderAll();
    }
  }

  applyPathforCurve(string: any, radius: any) {
    this.selectedCurve = string;
    this.arcAmount = radius;
    if (this.selectedText && this.selectedText.type === 'text') {
      let pathString = '';
      const fixedRadius = 40;
      const centerX = this.selectedText.left || 300; // Keep the center aligned
      const centerY = this.selectedText.top || 300;
      if (string == 'arc') {
        pathString = `M ${-fixedRadius} 0 A ${fixedRadius} ${fixedRadius} 0 1 1 ${fixedRadius} 0 
                A ${fixedRadius} ${fixedRadius} 0 1 1 ${-fixedRadius} 0`
      }
      const totalArcLength = Math.PI * fixedRadius; // Half-circle length
      const textWidth = this.selectedText.width || 100; // Get text width
      const textPath = new fabric.Path(pathString, {
        stroke: "", // No stroke
        fill: "", // No fill
        selectable: false,
        evented: false,
      });
      this.selectedText.set({
        path: textPath,
        textAlign: "bottom",  // Avoids unnecessary spacing
        pathSide: "center", // Keeps text aligned to the center of the arc
        pathAlign: "center",
        charSpacing: radius,
        left: centerX, // Keep text positioned correctly
        top: centerY,
        // angle: 0,
      });
      this.selectedText.setCoords();
      this.canvas.renderAll();
    }
  }

  resetPathforCurve() {
    if (this.isArcEnabled) {
      if (this.selectedText && this.selectedText.type === 'text') {
        this.selectedText.set({
          path: null, // Remove the path
          textAlign: "left", // Reset text alignment
          pathSide: undefined,
          pathAlign: undefined,
          charSpacing: 0, // Reset spacing
          left: this.selectedText.left || 300, // Keep it positioned
          top: this.selectedText.top || 300,
        });

        this.selectedText.setCoords();
        this.canvas.renderAll();
      }
      this.isArcEnabled = false;
    } else {
      this.isArcEnabled = true;
      this.applyPathforCurve('arc', 0)
    }
  }

  changeArcRadius(event: any) {
    const target = event.target as HTMLInputElement;
    this.arcAmount = Number(target.value);
    this.applyPathforCurve('arc', this.arcAmount);
  }

  // text ends

  renderPredefinedTemplates(): void {
    if (!this.templateCanvasRefs || this.templateCanvasRefs.length === 0) {
      console.warn("No template canvas references available.");
      return;
    }

    this.templateCanvasRefs.forEach((templateRef, index) => {
      if (!templateRef?.nativeElement) {
        console.warn(`Canvas reference at index ${index} is undefined.`);
        return;
      }

      const templateCanvas = new fabric.Canvas(templateRef.nativeElement, {
        width: 150,
        height: 100,
        backgroundColor: 'transparent'
      });

      const template = this.textTemplates?.[index];
      if (template) {
        this.addText(templateCanvas, '', template.id);
        templateCanvas.renderAll()
      } else {
        console.warn(`Template not found for index: ${index}`);
      }

      // Ensure Fabric.js updates the canvas
      templateCanvas.renderAll();
    });
  }

  addPredefinedText(template: any) {
    this.addText(this.canvas, template.text, template.id);
  }

  // Add Custom Text
  addCustomText() {
    this.addText(this.canvas, 'Text');
    this.showAddElementModal = false;
  }

  // Add Image
  addImage(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      fabric.Image.fromURL(e.target.result).then((img) => {
        img.scaleToWidth(200);
        const uniqueId = 'item_' + Date.now();
        img.set({
          id: uniqueId,
          left: 15,
          top: 5,
          selectable: true,
          hasControls: true,
          type: 'image',
        });

        this.canvas.add(img);
        this.canvas.setActiveObject(img);
        this.reapplyObjectStyles();
        this.canvas.renderAll();
        this.saveState()
        this.itemList.unshift({ id: uniqueId, type: 'image', name: file.name, visible: true });
      });
    };
    reader.readAsDataURL(file);
    this.showAddElementModal = false;
  }

  onBrightnessChange(event: any) {
    this.imgBrightness = event.target.value
    if (this.selectedImage) {
      const image: any = this.selectedImage;
      const currentFilters = image.filters || [];
      const brightnessFilterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'Brightness'
      );

      if (brightnessFilterIndex !== -1) {
        currentFilters.splice(brightnessFilterIndex, 1); // Remove the existing brightness filter
      }

      // Add the new brightness filter
      const brightnessFilter = new fabric.filters.Brightness({
        brightness: this.imgBrightness / 100, // Value between -1 (dark) and 1 (bright)
      });
      image.filters.push(brightnessFilter);
      image.applyFilters();
      this.canvas?.renderAll(); // Re-render the canvas to reflect the changes
    }
  }

  onContrastChange(event: any) {
    this.imgContrast = event.target.value
    if (this.selectedImage) {
      const image: any = this.selectedImage;
      const currentFilters = image.filters || [];
      const filterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'Contrast'
      );

      if (filterIndex !== -1) {
        currentFilters.splice(filterIndex, 1); // Remove the existing brightness filter
      }

      // Add the new brightness filter
      const Filter = new fabric.filters.Contrast({
        contrast: this.imgContrast / 100, // Value between -1 (dark) and 1 (bright)
      });
      image.filters.push(Filter);
      image.applyFilters();
      this.canvas?.renderAll(); // Re-render the canvas to reflect the changes
    }
  }

  onSaturationChange(event: any) {
    this.imgSaturation = event.target.value
    if (this.selectedImage) {
      const image: any = this.selectedImage;
      const currentFilters = image.filters || [];
      const filterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'Saturation'
      );

      if (filterIndex !== -1) {
        currentFilters.splice(filterIndex, 1); // Remove the existing brightness filter
      }

      // Add the new brightness filter
      const Filter = new fabric.filters.Saturation({
        saturation: this.imgSaturation / 100, // Value between -1 (dark) and 1 (bright)
      });
      image.filters.push(Filter);
      image.applyFilters();
      this.canvas?.renderAll(); // Re-render the canvas to reflect the changes
    }
  }

  onHueChange(event: any) {
    this.imgHue = event.target.value
    if (this.selectedImage) {
      const image: any = this.selectedImage;
      const currentFilters = image.filters || [];
      const filterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'HueRotation'
      );

      if (filterIndex !== -1) {
        currentFilters.splice(filterIndex, 1); // Remove the existing brightness filter
      }

      // Add the new brightness filter
      const Filter = new fabric.filters.HueRotation({
        rotation: this.imgHue * 3.6, // Value between -1 (dark) and 1 (bright)
      });
      image.filters.push(Filter);
      image.applyFilters();
      this.canvas?.renderAll(); // Re-render the canvas to reflect the changes
    }
  }

  onBlurChange(event: any) {
    this.imgBlur = event.target.value;  // Get blur value from the slider

    if (this.selectedImage) {
      const image: any = this.selectedImage;  // Get the selected image

      // Get the current filters applied to the image
      const currentFilters = image.filters || [];

      // Check if the image already has a blur filter and remove it if exists
      const filterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'Blur'
      );

      if (filterIndex !== -1) {
        currentFilters.splice(filterIndex, 1); // Remove the existing blur filter
      }

      // Create the new blur filter with the current blur value
      const blurFilter = new fabric.filters.Blur({
        blur: this.imgBlur / 100,  // Set the blur amount (value between 0 and 1)
      });

      // Push the new blur filter into the filters array
      currentFilters.push(blurFilter);

      // Apply the filters to the image
      image.filters = currentFilters;
      image.applyFilters();  // Apply the filters to the image
      this.canvas?.renderAll();  // Re-render the canvas to reflect the changes
    }
  }

  onNoiseChange(event: any) {
    this.imgNoise = event.target.value;
    if (this.selectedImage) {
      const image: any = this.selectedImage;
      const currentFilters = image.filters || [];
      const filterIndex = currentFilters.findIndex(
        (filter: any) => filter.type === 'Noise'
      );

      if (filterIndex !== -1) {
        currentFilters.splice(filterIndex, 1);
      }
      const noiseFilter = new fabric.filters.Noise({
        noise: this.imgNoise * 10,
      });
      currentFilters.push(noiseFilter);
      image.filters = currentFilters;
      image.applyFilters();
      this.canvas?.renderAll();
    }
  }


  getFilterValue(filters: any[], type: any) {
    const filter = filters.find(f => f.type === type);
    if (filter) {
      const value = Object.values(filter)[0]; // Get the second property (the value)
      return typeof value === "number" ? value : 0; // Ensure it always returns a number
    }
    return 0; // Default value
  }
  // options for obj

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

  selectItem(itemId: string) {
    // Find the Fabric.js object in the itemsList
    const item = this.canvas.getObjects().find((obj: any) => obj.id === itemId);
    if (item) {
      this.canvas.setActiveObject(item); // Select the object
      this.canvas.renderAll(); // Re-render to show selection
    }
    //for highlighting
    // const selectedId = itemId;
    // const items = document.querySelectorAll('.item-list li');
    // items.forEach((item) => {
    //   if (item.getAttribute('data-id') === selectedId) {
    //     item.classList.add('selected');
    //   } else {
    //     item.classList.remove('selected');
    //   }
    // });
  }


  async saveCanvasDataToDB(): Promise<void> {
    const scaleFactor = 3;

    try {
      await this.processCanvasObjects(scaleFactor);
      await this.toggleCanvas();
      await this.processCanvasObjects(scaleFactor);
      await this.uploadImage();
    } catch (error) {
      console.error("Error saving canvas data:", error);
    }
  }

  private async processCanvasObjects(scaleFactor: number): Promise<void> {
    const promises = this.canvas?.getObjects().map(async (obj: any) => {
      let file = obj ? this.canvas.toDataURL({ format: 'png', multiplier: scaleFactor, quality: 1.0 }) : '';
      return this.convertToBlob(file);
    }) || [];

    await Promise.all(promises); // Wait for all blobs to be processed
  }

  async convertToBlob(formData: string): Promise<void> {
    try {
      const response: any = await fetch(formData);
      const blob: any = await response.blob();

      if (this.isCanvas1Visible) {
        this.frontImgName = `${Date.now()}_${this.userData.user_Name}_front.png`
        this.formDataFront.append('image', blob, this.frontImgName);
      } else {
        this.BackImgName = `${Date.now()}_${this.userData.user_Name}_back.png`
        this.formDataBack.append('image', blob, this.BackImgName);
      }
    } catch (error) {
      console.error('Error converting canvas to Blob:', error);
    }
  }

  togglePanel(panelType: string) {
    this.activePanel = panelType; // Open new panel
    if (panelType == 'Templates') {
      setTimeout(() => {
        this.renderPredefinedTemplates();
      }, 300);
      this.renderPredefinedTemplates();
    }
  }


  checkSelectedObject(): void {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && activeObject.type === 'text') {
      this.selectedText = activeObject;
      this.CurrentSelected('text');
    } else if (activeObject && activeObject.type === 'image') {
      this.selectedImage = activeObject;
      this.CurrentSelected('image');
    } else {
      this.selectedText = null;
      this.selectedImage = null;
    }
  }

  CurrentSelected(type: any) {
    if (type == 'text') {
      this.textcolor = this.selectedText.fill as string;
      this.textfont = this.selectedText.fontFamily || 'Oswald';
      this.isBold = this.selectedText.fontWeight === 'bold';
      this.fontSize = this.selectedText.fontSize || 24;
      this.textStrokeSize = this.selectedText.strokeWidth || 50;
      this.shadowBlur = this.selectedText.shadow?.blur || 60;
      this.shadowOffsetX = this.selectedText.shadow?.offsetX || 0;
      this.shadowOffsetY = this.selectedText.shadow?.offsetY || 0;
      this.shadowColor = this.selectedText.shadow?.color || '#000000';
      this.hasFill = !this.selectedText.stroke;
      this.opacity = this.selectedText.opacity ? this.selectedText.opacity * 100 : 1;
      this.rotate = Math.round(this.selectedText.angle) || 0;
      this.text = this.selectedText.text;
      this.lineHeight = this.selectedText.lineHeight ? Math.round(this.selectedText.lineHeight) * 100 : 100;
      this.togglePanel('Text');
    } else if (type == 'image') {
      this.imgBlur = this.getFilterValue(this.selectedImage.filters, 'Blur') * 100;
      this.imgBlur = Math.round(this.imgBlur);
      this.imgBrightness = this.getFilterValue(this.selectedImage.filters, 'Brightness') * 100;
      this.imgBrightness = Math.round(this.imgBrightness);
      this.imgHue = this.getFilterValue(this.selectedImage.filters, 'HueRotation') / 3.6;
      this.imgHue = Math.round(this.imgHue);
      this.imgContrast = this.getFilterValue(this.selectedImage.filters, 'Contrast') * 100;
      this.imgContrast = Math.round(this.imgContrast);
      this.imgSaturation = this.getFilterValue(this.selectedImage.filters, 'Saturation') * 100;
      this.imgSaturation = Math.round(this.imgSaturation);
      this.imgNoise = this.getFilterValue(this.selectedImage.filters, 'Noise') / 10;
      this.imgNoise = Math.round(this.imgNoise);
      this.selectedText = null;
      this.togglePanel('Image');
    }
  }


  toggleOpen() {
    this.isArcEnabled = !this.isArcEnabled;
  }


  uploadImage(): any {
    const formData = new FormData();
    formData.append('userId', this.userData.user_Name);
    formData.append('price', this.priceRange);
    formData.append('teeName', this.designName);
    formData.append('role', this.userData.user_Role);
    formData.append('frontUrl', this.frontImgName || '');
    formData.append('backUrl', this.BackImgName || '');
    formData.append('teeColor', this.imageColor);

    // 🔹 Append image files to FormData
    if (this.formDataFront) {
      const frontImage = this.formDataFront.get('image');
      if (frontImage) {
        formData.append('frontImage', frontImage as Blob);
      }
    }
    if (this.formDataBack) {
      const backImage = this.formDataBack.get('image');
      if (backImage) {
        formData.append('backImage', backImage as Blob);
      }
    }
    this.appservice.postImage(formData).subscribe(
      (response) => {
        console.log(response, 'response')
        this.router.navigate(['/tees']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // changeImage(index: any) {
  //   this.imageFrontSrc = this.imageFrontUrls[index];
  //   this.imageBackSrc = this.imageBackUrls[index];
  //   if (this.currentSide == 'front') {
  //     this.drawImageOnCanvas(this.imageFrontSrc);
  //   } else {
  //     this.drawImageOnCanvas(this.imageBackSrc);
  //   }
  //   switch (index) {
  //     case 0:
  //       this.imageColor = 'Onyx black';
  //       break;
  //     case 1:
  //       this.imageColor = 'Pearl white';
  //       break;
  //     case 2:
  //       this.imageColor = 'Sapphire blue';
  //       break;
  //     case 3:
  //       this.imageColor = 'Ruby maroon';
  //       break;
  //   }
  // }
}
