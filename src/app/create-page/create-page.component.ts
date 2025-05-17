import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import { localStorageService } from '../local-storage-service';
import * as fabric from 'fabric';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { titleTextTemplates, imageFrontUrls, imageBackUrls } from '../common-constant';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { HeaderPageComponent } from "../header-page/header-page.component";
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, ColorPickerModule, FormsModule, PopoverModule, HeaderPageComponent, LoaderComponent],
  providers: [AppServiceService],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('itemListRef', { static: false }) itemListRef!: ElementRef<HTMLUListElement>;
  @ViewChildren('templateCanvas') templateCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('wrapper', { static: true }) wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('container', { static: true }) containerRef!: ElementRef<HTMLDivElement>;
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
  mobilePropertyButton: any = 'Text Properties';

  // text
  selectedText: any;
  text: any = '';
  textfont: string = 'Oswald';  // Default font
  textcolor: string = '#0056b3'; // Default color
  hasFill: any;
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

  //shape
  selectedShape: any;
  shapeFill: string = '#000000'; // Default fill color
  isShapeStrokeEnabled = false;
  shapeStrokeSize = 0;
  shapeStrokeColor: string = '#9d9d9d';

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
  titleTextTemplates: any = titleTextTemplates;


  // for image
  selectedImage: any;
  imgBrightness: any;
  imgContrast: any;
  imgSaturation: any;
  imgHue: any;
  imgBlur: any = 0;
  imgNoise: any = 0;

  // for tee color
  imageFrontSrc: any = imageFrontUrls[1].value;
  imageFrontUrls = imageFrontUrls;
  imageBackSrc: any = imageBackUrls[1].value;
  imageBackUrls = imageBackUrls;
  imageColor: any = imageFrontUrls[1].key;

  state: any[] = [];
  currentStateIndex: number = -1;
  selectedColor: string = '#000'; // Default color

  userData: any;
  priceRange: any = 549;
  designName: any = 'Trial-Tee';
  formDataFront = new FormData();
  formDataBack = new FormData();

  gridSize = 18;
  guideLines: fabric.Line[] = [];
  alignmentThreshold = 5; // Tolerance for snapping

  canvasClicked = false;

  isLoading = false;

  //for zoom
  scale = 1;
  lastTouchDistance = 0;


  // for drawer
  isMobileView = true;
  drawerHeight = window.innerHeight * 0.3;
  minHeight = window.innerHeight * 0.2;
  maxHeight = window.innerHeight * 0.9;
  drawerOpen = false;
  htmlSvg = '<svg>'
  svgData: any;
  layerDrawerOpen = false;

  private dragging = false;
  private animationFrameId: number | null = null;

  constructor(
    private appservice: AppServiceService,
    public localStorage: localStorageService,
    private router: Router) {

    this.userData = this.localStorage.getUserLocalStorage();
    this.userData = JSON.parse(this.userData.userData);
    this.isMobileView = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    fabric.Object.prototype.objectCaching = false;
    this.titleTextTemplates = [...titleTextTemplates];
    this.textTemplates = [...this.titleTextTemplates];
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 584,   // logical width
      height: 904,  // logical height
      backgroundColor: 'transparent',
    });
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const upperCanvas = canvasElement.nextElementSibling as HTMLCanvasElement; // Overlay canvas
    const left = this.isMobileView ? -18.2 : 28.2;
    const top = this.isMobileView ? 0.7 : 6;
    upperCanvas.style.left = left + '%';
    upperCanvas.style.top = top + '%';
    const scale = this.isMobileView ? 0.17 : 0.7;
    upperCanvas.style.transform = `scale(${scale})`;
    this.canvas.setZoom(scale);

    // Optional but HIGHLY recommended
    this.canvas.contextContainer.imageSmoothingEnabled = true;
    this.canvas.contextContainer.imageSmoothingQuality = 'high';

    this.saveState();

    // Track text changes in real-time
    this.canvas.on('text:changed', (event) => {
      if (this.selectedText && this.selectedText.objectType === 'text') {
        this.checkSelectedObject()
        this.updateTextName(this.selectedText.id, this.selectedText.text);
        this.reapplyObjectStyles();
      }
    });

    this.initSortable();

    // Track selected text
    this.canvas.on('selection:created', (event: any) => {
      if (event.selected.length > 1) return;
      this.checkSelectedObject()
      this.reapplyObjectStyles();
    });

    this.canvas.on('object:modified', () => {
      this.checkSelectedObject();
      this.removeGuideLines();
      this.reapplyObjectStyles();
    });

    // Track selected text
    this.canvas.on('selection:updated', () => {
      this.checkSelectedObject();
      this.reapplyObjectStyles();
    });
    this.canvas.on('selection:cleared', () => {
      this.selectedText = null
      this.selectedImage = null;
      this.selectedShape = null;
      this.togglePanel('Properties');
      this.removeGuideLines();
      this.drawerOpen = false;
    });

    this.canvas.on('mouse:down', () => {
      this.canvasClicked = true;
    });

    // Initialize Snap to Grid
    this.initSnapToGrid();


    //for zoom
    const wrapper = this.wrapperRef.nativeElement;
    const container: any = this.containerRef.nativeElement;

    const sizeScale = this.isMobileView ? 1.6 : 0.5;
    this.scale = sizeScale;
    if (!this.isMobileView) container.style.maxHeight = 0;
    container.style.transform = `translate(-50%, -50%) scale(${sizeScale})`;

    wrapper.addEventListener('wheel', (e: WheelEvent) => {
      if (!e.ctrlKey) return;
      e.preventDefault();

      const delta = e.deltaY * -0.0085;
      this.scale = Math.min(Math.max(0.2, this.scale + delta), 5);

      container.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
    }, { passive: false });

    wrapper.addEventListener('touchstart', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        this.lastTouchDistance = this.getTouchDistance(e);
      }
    });

    wrapper.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length !== 2) return;
      e.preventDefault();

      const newDist = this.getTouchDistance(e);
      const delta = (newDist - this.lastTouchDistance) * 0.0025;
      this.lastTouchDistance = newDist;

      this.scale = Math.min(Math.max(0.2, this.scale + delta), 5);
      container.style.transform = `translate(-50%, -50%) scale(${this.scale})`;
    }, { passive: false });
  }


  getTouchDistance(e: TouchEvent): number {
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }



  @HostListener('document:click', ['$event'])

  onClick(event: MouseEvent) {
    const clickedElement = event.target as HTMLElement;
    const isInsidePanel = clickedElement.closest('.wrapper');
    if (!this.canvasClicked && isInsidePanel) {
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
      console.log('✅ Deselected because click was outside canvas');
    }
    this.canvasClicked = false;
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
        cornerSize: 25,
        transparentCorners: false,
        selectionBackgroundColor: 'rgba(129, 129, 129, 0.3)',
        borderScaleFactor: 5
      });
      obj.setCoords();
    });
    this.canvas.renderAll();
  }

  toggleCanvas() {
    this.canvas.discardActiveObject();
    let side = this.isCanvas1Visible ? 'front' : 'back';
    this.processCanvasObjects(side);
    this.saveState(); // Save current state before switching
    this.canvas.clear();
    const canvasContainer = document.querySelector('.canvas-containers') as HTMLElement;

    if (this.isCanvas1Visible) {
      if (this.canvasData2) {
        this.canvas.loadFromJSON(this.canvasData2, () => {
          this.canvas.requestRenderAll();
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
          this.canvas.requestRenderAll();
        });
      } else {
        this.initializeCanvas1();
      }
      this.canvas2ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas1ItemList;
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageFrontSrc})`;
    }
    this.canvas.discardActiveObject();
    this.isCanvas1Visible = !this.isCanvas1Visible;
  }

  saveState() {
    if (this.isCanvas1Visible) {
      this.canvasData1 = JSON.stringify(this.canvas.toObject(['selectable', 'angle', 'scaleX', 'scaleY', 'top', 'left', 'id', 'type', 'name', 'visibility', 'objectType']));
    } else {
      this.canvasData2 = JSON.stringify(this.canvas.toObject(['selectable', 'angle', 'scaleX', 'scaleY', 'top', 'left', 'id', 'type', 'name', 'visibility', 'objectType']));
    }
  }

  // Initialize Snap to Grid & Alignment
  initSnapToGrid() {
    this.canvas.on('object:moving', (event) => {
      const obj = event.target;
      if (!obj) return;
      const objCenterX = obj.left! + obj.width! * obj.scaleX! / 2;
      const objCenterY = obj.top! + obj.height! * obj.scaleY! / 2;
      this.removeGuideLines();
      let closestAlignment: any = this.findClosestAlignment(obj);
      if (closestAlignment) {
        obj.set(closestAlignment.position);
        this.addGuideLine(closestAlignment.line[0], closestAlignment.line[1], closestAlignment.line[2], closestAlignment.line[3]);
      } else {
        let snapX = Math.round(objCenterX / this.gridSize) * this.gridSize;
        let snapY = Math.round(objCenterY / this.gridSize) * this.gridSize;
        if (Math.abs(objCenterX - snapX) < this.alignmentThreshold) {
          this.addGuideLine(snapX, 0, snapX, this.canvas.height! / this.canvas.getZoom());
          obj.set({ left: snapX - obj.width! * obj.scaleX! / 2 });
        }
        if (Math.abs(objCenterY - snapY) < this.alignmentThreshold) {
          this.addGuideLine(0, snapY, this.canvas.width! / this.canvas.getZoom(), snapY);
          obj.set({ top: snapY - obj.height! * obj.scaleY! / 2 });
        }
      }
      this.canvas.renderAll();
    });
  }

  // Find closest object for alignment
  findClosestAlignment(obj: fabric.Object) {
    let closest = null;
    let minDist = this.alignmentThreshold;

    const objCenterX = obj.left! + obj.width! * obj.scaleX! / 2;
    const objCenterY = obj.top! + obj.height! * obj.scaleY! / 2;

    this.canvas.getObjects().forEach(other => {
      if (other === obj) return;

      const otherCenterX = other.left! + other.width! * other.scaleX! / 2;
      const otherCenterY = other.top! + other.height! * other.scaleY! / 2;

      let distX = Math.abs(objCenterX - otherCenterX);
      let distY = Math.abs(objCenterY - otherCenterY);

      if (distX < minDist) {
        closest = {
          position: { left: otherCenterX - obj.width! * obj.scaleX! / 2 },
          line: [otherCenterX, 0, otherCenterX, this.canvas.height!]
        };
        minDist = distX;
      }

      if (distY < minDist) {
        closest = {
          position: { top: otherCenterY - obj.height! * obj.scaleY! / 2 },
          line: [0, otherCenterY, this.canvas.width!, otherCenterY]
        };
        minDist = distY;
      }
    });

    return closest;
  }

  // Function to create a guideline
  addGuideLine(x1: number, y1: number, x2: number, y2: number) {
    const line = new fabric.Line([x1, y1, x2, y2], {
      stroke: 'red',
      strokeWidth: 4,
      selectable: false,
      evented: false
    });
    this.canvas.add(line);
    this.guideLines.push(line);
  }

  // Remove all guidelines
  removeGuideLines() {
    this.guideLines.forEach(line => this.canvas.remove(line));
    this.guideLines = [];
  }

  openElementModal() {
    this.showAddElementModal = !this.showAddElementModal;
  }
  triggerFileInput() {
    this.imageInput.nativeElement.click();
  }


  async addElement(eventOrCanvas: any, text: string = '', templateId: string = ''): Promise<void> {
    // IMAGE UPLOAD MODE
    if (eventOrCanvas?.target?.files?.[0]) {
      const file = eventOrCanvas.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (e: any) => {
        const imgElement = new Image();
        imgElement.src = e.target.result;

        imgElement.onload = async () => {
          const MIN_WIDTH = 1620;
          const MIN_HEIGHT = 880;

          if (imgElement.naturalWidth < MIN_WIDTH || imgElement.naturalHeight < MIN_HEIGHT) {
            alert('Image must be at least 1920x1080 (1080p) for good print quality.');
            return;
          }

          try {
            const img = await fabric.Image.fromURL(e.target.result, { crossOrigin: 'anonymous' });
            const canvasWidth = this.canvas.getWidth();
            const canvasHeight = this.canvas.getHeight();
            const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const uniqueId = 'item_' + Date.now();

            img.set({
              scaleX: scale,
              scaleY: scale,
              left: (canvasWidth - scaledWidth) / 2,
              top: (canvasHeight - scaledHeight) / 2,
              selectable: true,
              hasControls: true,
              id: uniqueId,
              objectType: 'image',
            });

            this.canvas.add(img);
            this.canvas.setActiveObject(img);
            this.reapplyObjectStyles();
            this.canvas.renderAll();
            this.saveState();
            this.itemList.unshift({ id: uniqueId, type: 'image', name: file.name, visible: true });
            this.showAddElementModal = false;
          } catch (error) {
            console.error('Image loading failed:', error);
            alert('Failed to load image onto canvas.');
          }
        };

        imgElement.onerror = () => alert('Could not load the image.');
      };

      reader.readAsDataURL(file);
      eventOrCanvas.target.value = ''; // Allow re-uploading same file
      return;
    }

    if (this.svgData?.startsWith('<svg')) {
      try {
        const svgObj = await fabric.loadSVGFromString(this.svgData);
        console.log('SVG options:', svgObj);
        const objects = svgObj.objects.map((obj: any) => {
          obj.set({
            selectable: true,
            hasControls: true,
            id: 'item_' + Date.now(),
            objectType: 'svg',
          });
          return obj;
        });
        const svgGroup = fabric.util.groupSVGElements(objects, svgObj.options);
        const uniqueId = 'item_' + Date.now();

        svgGroup.set({
          left: this.canvas.getWidth() / 2 - (svgGroup.width ?? 0) / 2,
          top: this.canvas.getHeight() / 2 - (svgGroup.height ?? 0) / 2,
          scaleX: this.isMobileView ? 1 : 2,
          scaleY: this.isMobileView ? 1 : 2,
          selectable: true,
          hasControls: true,
          id: uniqueId,
          objectType: 'svg'
        });

        this.canvas.add(svgGroup);
        this.canvas.setActiveObject(svgGroup);
        this.itemList.unshift({ id: uniqueId, type: 'svg', name: 'SVG Object', visible: true });
        this.reapplyObjectStyles();
        this.canvas.renderAll();
        this.saveState();
      } catch (err) {
        console.error('Error loading SVG:', err);
        alert('Could not load SVG.');
      }
      return;
    }

    // TEXT OR SHAPE MODE
    const targetCanvas = eventOrCanvas;
    const uniqueId = 'item_' + Date.now();
    let elements = [];

    if (templateId) {
      const template = this.textTemplates.find((t: any) => t.id === templateId);
      if (!template) return;

      elements = template.elements.map((el: any, index: number) => ({
        ...el,
        selectable: targetCanvas === this.canvas,
        evented: targetCanvas === this.canvas,
      }));
    } else {
      elements = [{
        text,
        left: 62,
        top: 90,
        fontSize: 40,
        fontFamily: 'Oswald',
        fill: '#000000',
        type: 'text',
        selectable: targetCanvas === this.canvas,
        evented: targetCanvas === this.canvas,
      }];
    }

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const id = `${uniqueId}_${i}`;
      let object: fabric.Object;
      if (el.objectType === 'shape') {
        switch (el.type) {
          case 'rect':
            object = new fabric.Rect({
              left: this.isMobileView ? 50 : el.left,
              top: this.isMobileView ? 22 : el.top,
              width: this.isMobileView ? 2 : el.width,
              height: this.isMobileView ? 2 : el.height,
              fill: el.fill ?? '#000000',
              stroke: el.stroke,
              strokeWidth: el.strokeWidth,
              selectable: el.selectable,
              evented: el.evented,
              id,
              type: 'rect',
              objectType: 'shape',
            });
            if (targetCanvas === this.canvas) {
              object.height = 100;
              object.width = 100;
              object.left = 170;
              object.top = 350;
            }
            break;

          case 'circle':
            object = new fabric.Circle({
              left: el.left ?? 0,
              top: el.top ?? 0,
              radius: el.radius ?? 50,
              fill: el.fill ?? '#000000',
              stroke: el.stroke,
              strokeWidth: el.strokeWidth,
              selectable: el.selectable,
              evented: el.evented,
              id,
              type: 'circle',
            });
            break;

          case 'triangle':
            object = new fabric.Triangle({
              left: el.left ?? 0,
              top: el.top ?? 0,
              width: el.width ?? 80,
              height: el.height ?? 80,
              fill: el.fill ?? '#000000',
              stroke: el.stroke,
              strokeWidth: el.strokeWidth,
              selectable: el.selectable,
              evented: el.evented,
              id,
              type: 'triangle',
            });
            break;

          default:
            console.warn('Unsupported shape type:', el.type);
            return;
        }

        if (targetCanvas === this.canvas) {
          this.itemList.unshift({ id, type: 'shape', name: el.type, visible: true });
        }

      } else {
        object = new fabric.IText(el.text ?? '', {
          left: el.left ?? 0,
          top: el.top ?? 0,
          fontSize: el.fontSize ?? 40,
          fontFamily: el.fontFamily,
          fill: el.fill ?? '#000000',
          selectable: el.selectable,
          evented: el.evented,
          id,
          objectType: 'text',
        });
        if (targetCanvas === this.canvas) {
          this.itemList.unshift({ id, type: 'text', name: el.text, visible: true });
        }
      }

      object.scaleX = this.isMobileView ? 25 : 5;
      object.scaleY = this.isMobileView ? 25 : 5;
      object.setCoords();

      setTimeout(() => {
        targetCanvas.add(object);
        if (targetCanvas === this.canvas) {
          targetCanvas.setActiveObject(object);
        }
      }, 100);
    }

    this.canvasClicked = true;
    this.saveState();
    this.reapplyObjectStyles();
    targetCanvas.requestRenderAll();

    targetCanvas.renderAll();
  }

  updateTextName(itemId: string, newText: string): void {
    const item = this.itemList.find((item: any) => item.id === itemId);
    if (item) {
      item.name = newText;
    }
    this.text = newText;
  }

  changefill() {
    if (this.hasFill) {
      this.hasFill = null;
      this.changeTextColor(null);
    } else {
      this.hasFill = this.textcolor;
      this.changeTextColor(this.textcolor);
    }
  }

  changeTextColor(color: any): void {
    if (this.selectedText) {
      this.selectedText.set('fill', color);
      this.canvas.renderAll();
    }
  }

  changeFont(font: string): void {
    if (this.selectedText) {
      this.selectedText.set({ fontFamily: font });
      this.selectedText.setCoords();
      this.selectedText.initDimensions();
      this.canvas.requestRenderAll();
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
      if (this.selectedText && this.selectedText.objectType === 'text') {
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
    if (this.selectedText && this.selectedText.objectType === "text") {
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
    if (this.selectedText && this.selectedText.objectType === 'text') {
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
      if (this.selectedText && this.selectedText.objectType === 'text') {
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


  //shape


  updateShapeStroke(event: any = null, stroke: any = null) {
    if (event) {
      const target = event.target as HTMLInputElement;
      this.shapeStrokeSize = Number(target.value);
    }
    if (stroke) {
      this.shapeStrokeColor = stroke
    }
    if (this.selectedShape) {
      this.selectedShape.set({
        strokeWidth: event ? this.shapeStrokeSize / 20 : this.shapeStrokeSize / 20,
        stroke: stroke ? stroke : 'red'
      });
      this.reapplyObjectStyles();
      this.canvas.renderAll();
    }
  }

  resetShapeStroke() {
    if (this.isShapeStrokeEnabled) {
      if (this.selectedShape) {
        this.selectedShape.set({
          strokeWidth: 0,
          stroke: 'none'
        });
        this.canvas.renderAll();
        this.isShapeStrokeEnabled = false;
      }
    } else {
      this.isShapeStrokeEnabled = true;
      this.updateShapeStroke(null, this.strokeColor)
    }
  }

  //shape ends

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
        this.addElement(templateCanvas, '', template.id);
        templateCanvas.renderAll()
      } else {
        console.warn(`Template not found for index: ${index}`);
      }

      // Ensure Fabric.js updates the canvas
      templateCanvas.renderAll();
    });
  }

  addPredefinedText(template: any) {
    console.log('template', template);
    this.addElement(this.canvas, template.text, template.id);
  }

  // Add Custom Text
  addCustomText() {
    this.addElement(this.canvas, 'text');
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
      const newVisibility = !target.visible;
      target.set('visible', newVisibility);
      item.visible = newVisibility;
      console.log(target, this.canvas.getActiveObject())
      if (newVisibility) {
        this.canvas.setActiveObject(target);
      }
      this.canvas.renderAll();
    }
  }

  deleteItem(itemId: string): void {
    const target = this.canvas.getObjects().find((obj: any) => obj.id === itemId);
    if (target) {
      if (this.canvas.getActiveObject() === target) {
        this.canvas.discardActiveObject();
      }
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
    this.isLoading = true;
    this.canvas.discardActiveObject();
    if (!this.isCanvas1Visible) this.toggleCanvas();
    let side = this.isCanvas1Visible ? 'front' : 'back';
    try {
      await this.processCanvasObjects(side);
      setTimeout(() => {
        this.uploadImage();
      }, 100);
    } catch (error) {
      this.isLoading = false;
      console.error("Error saving canvas data:", error);
    }
  }

  private async processCanvasObjects(sideLabel: any): Promise<void> {
    const promises = this.canvas?.getObjects().map(async (obj: any) => {
      let file = obj ? this.canvas.toDataURL({ format: 'png', multiplier: 6, quality: 1.0 }) : '';
      return this.convertToBlob(file, sideLabel);
    }) || [];
    await Promise.all(promises);
  }

  async convertToBlob(formData: string, sideLabel: any): Promise<void> {
    try {
      const response: any = await fetch(formData);
      const blob: any = await response.blob();
      const filename = `${Date.now()}_${this.userData.user_Name}_${sideLabel}.png`;
      if (sideLabel == 'front') {
        this.formDataFront.append('image', blob, filename);
      } else {
        this.formDataBack.append('image', blob, filename);
      }
    } catch (error) {
      console.error('Error converting canvas to Blob:', error);
    }
  }

  togglePanel(panelType: string) {
    this.activePanel = panelType; // Open new panel
    if (panelType == 'Templates' || panelType == 'Shapes' || panelType == 'Svg') {
      this.toggleDrawer()
      setTimeout(() => {
        this.renderPredefinedTemplates();
      }, 1000);
      // this.renderPredefinedTemplates();
    }
  }


  checkSelectedObject(): void {
    const activeObject: any = this.canvas.getActiveObject();
    if (activeObject && activeObject.objectType === 'text') {
      this.selectedText = activeObject;
      activeObject.setCoords()
      this.CurrentSelected('text');
    }
    else if (activeObject && activeObject.objectType === 'image') {
      this.selectedImage = activeObject;
      this.CurrentSelected('image');
    } else if (activeObject && activeObject.objectType === 'shape') {
      this.selectedShape = activeObject;
      this.CurrentSelected('shape');
    } else {
      this.selectedText = null;
      this.selectedImage = null;
    }
  }

  CurrentSelected(type: any) {
    if (type == 'text') {
      this.textcolor = this.selectedText.fill as string;
      this.textfont = this.selectedText.fontFamily || 'CinemaGroovy';
      this.fontSize = this.selectedText.fontSize || 24;
      this.textStrokeSize = this.selectedText.strokeWidth * 20 || 50;
      this.shadowBlur = this.selectedText.shadow?.blur || 60;
      this.shadowOffsetX = this.selectedText.shadow?.offsetX || 0;
      this.shadowOffsetY = this.selectedText.shadow?.offsetY || 0;
      this.shadowColor = this.selectedText.shadow?.color || '#000000';
      this.hasFill = this.selectedText.fill;
      this.opacity = this.selectedText.opacity ? this.selectedText.opacity * 100 : 1;
      this.rotate = Math.round(this.selectedText.angle) || 0;
      this.text = this.selectedText.text;
      this.lineHeight = this.selectedText.lineHeight ? Math.round(this.selectedText.lineHeight) * 100 : 100;
      this.shadowEnabled = this.selectedText.shadow ? true : false;
      this.isTextStrokeEnabled = this.selectedText.stroke ? true : false;
      this.isArcEnabled = this.selectedText.path ? true : false;
      this.selectedImage = null;
      this.selectedShape = null;
      this.togglePanel('text');
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
      this.selectedShape = null;
      this.togglePanel('Image');
    } else if (type == 'shape') {
      console.log('shape', this.selectedShape);
      this.isShapeStrokeEnabled = this.selectedShape.stroke != 'none' && this.shapeStrokeSize != 0 ? true : false;
      this.shapeStrokeSize = this.selectedShape.strokeWidth * 20 || 0;
      this.selectedText = null;
      this.selectedImage = null;
      this.togglePanel('Shapes-editor');
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
        this.router.navigate(['/tees']);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setColor(id: any) {
    const canvasContainer = document.querySelector('.canvas-containers') as HTMLElement;
    this.imageFrontSrc = this.imageFrontUrls[id].value;
    this.imageBackSrc = this.imageBackUrls[id].value;
    if (this.isCanvas1Visible) {
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageFrontSrc})`;

    } else {
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageBackSrc})`;
    }
    this.imageColor = this.imageFrontUrls[id].key
  }

  onDivClick(string: any) {
    this.router.navigate([string]);
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }


  startDrag(event: TouchEvent) {
    this.dragging = true;
    event.preventDefault();
  }

  onDrag(event: TouchEvent) {
    if (!this.dragging) return;

    const touchY = event.touches[0].clientY;
    const targetHeight = window.innerHeight - touchY;
    const clampedHeight = Math.max(this.minHeight, Math.min(this.maxHeight, targetHeight));

    // cancel any previous animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // schedule height update in next frame
    this.animationFrameId = requestAnimationFrame(() => {
      this.drawerHeight = clampedHeight;
    });
  }

  endDrag() {

    this.dragging = false;
    this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  addSvg() {
    console.log('svg', this.svgData);
    const valid = this.isValidSVG(this.svgData);
    if (!valid) {
      window.alert("Svg icon not supported");
    } else {
      this.addElement(this.canvas);
    }
  }

  isValidSVG(input: string): boolean {
    if (typeof input !== 'string') return false;

    const trimmed = input.trim();

    // Check if it starts with <svg and ends with </svg>
    if (!trimmed.startsWith('<svg') || !trimmed.includes('</svg>')) {
      return false;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(trimmed, 'image/svg+xml');
      const svgEl = doc.documentElement;

      // Check if root is <svg> and there are no parser errors
      return (
        svgEl.nodeName === 'svg' &&
        !doc.querySelector('parsererror')
      );
    } catch {
      return false;
    }
  }

  toggleLayer() {
    this.layerDrawerOpen = !this.layerDrawerOpen;
    console.log('layerDrawerOpen', this.layerDrawerOpen);
    this.toggleDrawer();
  }

}
