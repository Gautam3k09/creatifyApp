import { AfterViewInit, Component, ElementRef, ViewChild, ViewChildren, QueryList, HostListener } from '@angular/core';
import { localStorageService } from '../local-storage-service';
import * as fabric from 'fabric';
import { CommonModule } from '@angular/common';
import Sortable from 'sortablejs';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';
import { imageFrontUrls, imageBackUrls, clipArts, graphics, legends, singleSide, doubleSide, grids, fabricTemplate } from '../common-constant';
import { AppServiceService } from '../app-service.service';
import { Router } from '@angular/router';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { LoaderComponent } from '../loader/loader.component';
import { CreatePageModalComponent } from './create-page-modal/create-page-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [CommonModule, ColorPickerModule, FormsModule, PopoverModule, LoaderComponent],
  providers: [AppServiceService],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.css',
})
export class CreatePageComponent implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('itemListRef', { static: false }) itemListRef!: ElementRef<HTMLUListElement>;
  @ViewChildren('templateCanvas') templateCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;
  canvas!: fabric.Canvas;
  canvasData1: any = null;
  canvasData2: any | null = null;
  isCanvas1Visible = true;
  canvas1ItemList: any = [];
  canvas2ItemList: any = [];
  itemList: any = [];
  activePanel: string = 'Templates';
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
  textHeight: number = 100;
  rotate: number = 0;
  lineHeight = 1;
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
  dropdownOpen = false;


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
  priceRange: any = 799;
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

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;

  zoomLevel = 1;
  minZoom = 0.2;
  maxZoom = 4;

  initialDistance = 0;
  lastZoom = 1;
  initialMidpoint = { x: 0, y: 0 };


  // for drawer
  isMobileView = true;
  drawerHeight = window.innerHeight * 0.3;
  minHeight = window.innerHeight * 0.2;
  maxHeight = window.innerHeight * 0.9;
  drawerOpen = false;
  htmlSvg = '<svg>'
  svgData: any;
  layerDrawerOpen = false;
  closeThreshold = window.innerHeight * 0.76;

  private dragging = false;
  private animationFrameId: number | null = null;
  private gridGroup?: fabric.Group;

  qualityStatus: any = 'green';
  //save

  //for templates
  clipArts = clipArts;
  graphics = graphics;
  legends = legends
  singleSide = singleSide;
  doubleSide = doubleSide;
  grids = grids;

  fabricTemplate = fabricTemplate;

  modalDialog: MatDialogRef<CreatePageModalComponent, any> | undefined;

  constructor(
    private appservice: AppServiceService,
    public localStorage: localStorageService,
    private router: Router,
    public matDialog: MatDialog,
  ) {

    this.userData = this.localStorage.getUserLocalStorage();
    this.userData = JSON.parse(this.userData.userData);
    this.isMobileView = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    fabric.Object.prototype.objectCaching = false;
    this.canvas = new fabric.Canvas(this.canvasRef.nativeElement, {
      width: 584,   // logical width
      height: 904,  // logical height
      backgroundColor: 'transparent',
    });
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const upperCanvas = canvasElement.nextElementSibling as HTMLCanvasElement; // Overlay canvas
    let left: any;
    if (window.innerWidth <= 340) {
      left = '-23.5vw';
    } else if (window.innerWidth <= 370) {
      left = '-20vw';
    } else if (this.isMobileView) {
      left = '-26vw';
    } else {
      left = '12.7vw';
    }
    const top = this.isMobileView ? 16 + 'vh' : 23 + 'vh';
    upperCanvas.style.marginLeft = left;
    upperCanvas.style.marginTop = top;
    const scale = 0.3;
    upperCanvas.style.transform = `scale(${scale})`;
    upperCanvas.style.transformOrigin = 'top';
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

    this.canvas.on('text:editing:entered', () => {
      setTimeout(() => {
        const ta = document.querySelector('body > textarea') as HTMLTextAreaElement | null;
        if (!ta) return;
        Object.assign(ta.style, {
          position: 'fixed',
          top: '0px',
          left: '0px',
          width: '1px',
          height: '1px',
          margin: '0',
          padding: '0',
          border: 'none',
          outline: 'none',
          opacity: '0',
          overflow: 'hidden',
          pointerEvents: 'none',
          resize: 'none',
        });
        // ensure focus doesn’t scroll
        ta.focus({ preventScroll: true });
      }, 0);
    });

    // Initialize Snap to Grid
    this.initSnapToGrid();

    const wrapper = this.wrapperRef.nativeElement;
    const container = this.containerRef.nativeElement;

    // Scroll wheel zoom centered on pointer
    wrapper.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();

        const delta = -e.deltaY * 0.01;
        const oldZoom = this.zoomLevel;
        const newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.zoomLevel + delta));

        const rect = container.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        const zoomFactor = newZoom / oldZoom;

        this.zoomLevel = newZoom;
        this.updateZoom();

        // Adjust scroll to keep zoom centered on pointer
        const scrollLeft = wrapper.scrollLeft;
        const scrollTop = wrapper.scrollTop;

        wrapper.scrollLeft = (offsetX * (zoomFactor - 1)) + scrollLeft;
        wrapper.scrollTop = (offsetY * (zoomFactor - 1)) + scrollTop;
      }
    });

    // Touch pinch zoom

    wrapper.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        this.initialDistance = this.getDistance(e.touches[0], e.touches[1]);
        this.lastZoom = this.zoomLevel;
        this.initialMidpoint = this.getMidpoint(e.touches[0], e.touches[1]);
      }
    }, { passive: false });

    wrapper.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const newDist = this.getDistance(e.touches[0], e.touches[1]);
        let scaleFactor = newDist / this.initialDistance;
        let newZoom = Math.min(this.maxZoom, Math.max(this.minZoom, this.lastZoom * scaleFactor));

        const oldZoom = this.zoomLevel;
        const zoomFactor = newZoom / oldZoom;

        const rect = container.getBoundingClientRect();
        const offsetX = this.initialMidpoint.x - rect.left;
        const offsetY = this.initialMidpoint.y - rect.top;

        this.zoomLevel = newZoom;
        this.updateZoom();

        const scrollLeft = wrapper.scrollLeft;
        const scrollTop = wrapper.scrollTop;

        wrapper.scrollLeft = (offsetX * (zoomFactor - 1)) + scrollLeft;
        wrapper.scrollTop = (offsetY * (zoomFactor - 1)) + scrollTop;
      }
    }, { passive: false });
    // this.onImageTemplateClick({ id: 1, name: 'mustang', url: 'assets/Templates/single_side/HeatWave.png' }, true)
  }

  updateZoom() {
    const container = this.containerRef.nativeElement;
    container.style.transform = `scale(${this.zoomLevel})`;
  }

  getDistance(t1: Touch, t2: Touch): number {
    const dx = t2.clientX - t1.clientX;
    const dy = t2.clientY - t1.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getMidpoint(t1: Touch, t2: Touch): { x: number, y: number } {
    return {
      x: (t1.clientX + t2.clientX) / 2,
      y: (t1.clientY + t2.clientY) / 2,
    };
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

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.font-select-container')) {
      this.dropdownOpen = false;
    }
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
        cornerSize: 60,
        hasCorners: false,
        transparentCorners: false,
        selectionBackgroundColor: 'rgba(129, 129, 129, 0.3)',
        borderScaleFactor: 5,
        touchCornerSize: 60,
      });

      if (obj.controls && obj.controls['mtr']) {
        obj.controls['mtr'].visible = false;
      }
      obj.setCoords();
    });
    this.canvas.renderAll();
  }

  toggleCanvas() {
    const canvasContainer = document.querySelector('.container') as HTMLElement;
    this.canvas.renderOnAddRemove = false;
    this.canvas.discardActiveObject();
    this.saveState();
    this.canvas.clear();
    if (this.isCanvas1Visible) {
      if (this.canvasData2) {
        this.canvas.loadFromJSON(this.canvasData2, () => {
          this.canvas.renderOnAddRemove = true;
          this.safeRender();
        });
      } else {
        this.initializeCanvas2();
        this.canvas.renderOnAddRemove = true;
      }
      this.canvas1ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas2ItemList;
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageBackSrc})`;

    } else {
      if (this.canvasData1) {
        this.canvas.loadFromJSON(this.canvasData1, () => {
          this.canvas.renderOnAddRemove = true;
          this.safeRender();
        });
      } else {
        this.initializeCanvas1();
        this.canvas.renderOnAddRemove = true;
      }
      this.canvas2ItemList = this.itemList;
      this.itemList = [];
      this.itemList = this.canvas1ItemList;
      if (canvasContainer) canvasContainer.style.backgroundImage = `url(${this.imageFrontSrc})`;
    }

    // Toggle the canvas visibility flag
    this.isCanvas1Visible = !this.isCanvas1Visible;
  }

  // Debounced render method to avoid frame jank
  renderTimeout: any;
  safeRender() {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => {
      this.canvas.requestRenderAll();
    }, 10);
  }

  saveState() {
    const properties = ['selectable', 'angle', 'scaleX', 'scaleY', 'top', 'left', 'id', 'type', 'name', 'visibility', 'objectType'];
    const json = JSON.stringify(this.canvas.toDatalessJSON(properties)); // Use toDatalessJSON for performance
    if (this.isCanvas1Visible) {
      this.canvasData1 = json;
    } else {
      this.canvasData2 = json;
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

  async addElement(eventOrCanvas: any, text: string = '', templateId: string = '', fromUrl: any = ''): Promise<void> {
    if (fromUrl) {
      await this.addImageFromUrl(fromUrl, true);
      return;
    }

    // IMAGE UPLOAD MODE
    if (eventOrCanvas?.target?.files?.[0]) {
      const file = eventOrCanvas.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = async (e: any) => {
        const imgElement = new Image();
        imgElement.src = e.target.result;

        imgElement.onload = async () => {
          const targetDPI = 300;
          const imgWidth = imgElement.naturalWidth;
          const imgHeight = imgElement.naturalHeight;

          // Calculate max print size in inches at target DPI
          const maxPrintWidthInches = imgWidth / targetDPI;
          const maxPrintHeightInches = imgHeight / targetDPI;

          // Define your desired minimum print size in inches (for example, 6x4 inches)
          const minPrintWidthInches = 6;
          const minPrintHeightInches = 4;

          if (
            maxPrintWidthInches < minPrintWidthInches ||
            maxPrintHeightInches < minPrintHeightInches
          ) {
            alert(
              `Image resolution is too low for a good print at ${minPrintWidthInches}" × ${minPrintHeightInches}". ` +
              `Your image can only print at approximately ${maxPrintWidthInches.toFixed(2)}" × ${maxPrintHeightInches.toFixed(2)}" ` +
              `at ${targetDPI} DPI. Please upload a higher resolution image or reduce print size. or upscale this image`
            );
            // return;
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
          } catch (error) {
            console.error('Image loading failed:', error);
            alert('Failed to load image onto canvas.');
          }
        };

        imgElement.onerror = () => alert('Could not load the image.');
      };

      reader.readAsDataURL(file);
      eventOrCanvas.target.value = ''; // Allow re-uploading same file
      setTimeout(() => {
        this.updateQualityStatus()

      }, 500);
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
      const template = this.fabricTemplate.find((t: any) => t.name === templateId);
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
      let object: fabric.Object | null = null;
      if (el.objectType === 'shape') {
        switch (el.type) {
          case 'rect':
            object = new fabric.Rect({
              left: el.left ?? 0,
              top: el.top ?? 0,
              width: el.width ?? 10,
              height: el.height ?? 10,
              fill: el.fill ?? '#000000',
              stroke: el.stroke ?? undefined,
              strokeWidth: el.strokeWidth ?? 0,
              selectable: el.selectable ?? false,
              evented: el.evented ?? false,
              objectCaching: false,
              type: 'rect',
              objectType: 'shape',
              id,
            });
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

          case 'line':
            object = new fabric.Line([el.x1, el.y1, el.x2, el.y2], {
              stroke: el.stroke ?? '#000000',
              strokeWidth: el.strokeWidth ?? 2,
              strokeDashArray: el.strokeDashArray ?? undefined,
              selectable: el.selectable,
              evented: el.evented,
              id,
              type: 'line',
              objectType: 'shape',
              left: el.left ?? 0,
              top: el.top ?? 0
            });
            break;

          default:
            console.warn('Unsupported shape type:', el.type);
            return;
        }

        if (targetCanvas === this.canvas) {
          this.itemList.unshift({ id, type: 'shape', name: el.type, visible: true });
        }

      } else if (el.objectType === 'image') {
        await this.addImageFromUrl(el, false);
      }
      else {
        object = new fabric.IText(el.text ?? '', {
          fontFamily: el.fontFamily,
          left: el.left ?? 0,
          top: el.top ?? 0,
          fontSize: el.fontSize ?? 40,
          fill: el.fill ? el.fill != 'transparent' ? el.fill : null : '#000000',
          stroke: el.stroke ? el.stroke : null,
          strokeWidth: el.strokeWidth ? el.strokeWidth / 20 : 0,
          selectable: el.selectable,
          evented: el.evented,
          id,
          objectType: 'text',
          lineHeight: el.lineHeight ?? this.lineHeight,
          charSpacing: el.charSpacing ?? this.charSpacing,
          angle: el.angle ?? 0,
          fontStyle: el.fontStyle ?? 'normal',
          textAlign: el.textAlign ?? 'center',
          opacity: el.opacity ?? 1,
          fontWeight: el.fontWeight ?? 'normal',
        });
        if (el.textheight) object.set('textheight', el.textheight);
        if (el.textheight) {
          const height = (object.height ?? 0) * el.textheight / 50;
          const clipPath = new fabric.Rect({
            left: 0,
            top: object.height! / 2 - el.textheight,
            width: object.width ?? 0,
            height: height,
            originX: 'center',
            originY: 'top',
          });
          object['clipPath'] = clipPath;
        }
        if (targetCanvas === this.canvas) {
          this.itemList.unshift({ id, type: 'text', name: el.text, visible: true });
        }
      }

      if (object) {
        object.scaleX = this.isMobileView ? 20 : 5;
        object.scaleY = this.isMobileView ? 20 : 5;
        object.setCoords();
      }

      if (targetCanvas && object) {
        setTimeout(() => {
          targetCanvas.add(object);
          if (targetCanvas === this.canvas) {
            // targetCanvas.setActiveObject(object);
          }
        }, 100);
      }
    }

    this.canvasClicked = true;
    this.saveState();
    this.reapplyObjectStyles();
    this.reorderCanvasObjects();
    targetCanvas.requestRenderAll();
    targetCanvas.renderAll();
    // this.updateQualityStatus()
  }

  async addImageFromUrl(fromUrl: any, selectable: any): Promise<void> {
    const img = await fabric.Image.fromURL(fromUrl.url, { crossOrigin: 'anonymous' });
    const canvasWidth = this.canvas.getWidth();
    const canvasHeight = this.canvas.getHeight();
    const scale = Math.min(canvasWidth / img.width, canvasHeight / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    const uniqueId = 'item_' + Date.now();

    img.set({
      scaleX: fromUrl.scaleX ? fromUrl.scaleX : scale,
      scaleY: fromUrl.scaleY ? fromUrl.scaleY : scale,
      left: fromUrl.left ? fromUrl.left : (canvasWidth - scaledWidth) / 2,
      top: fromUrl.top ? fromUrl.top : (canvasHeight - scaledHeight) / 2,
      selectable: true,
      hasControls: true,
      id: uniqueId,
      objectType: 'image',
      angle: fromUrl.angle ?? 0,
    });

    this.canvas.add(img);
    if (selectable) this.canvas.setActiveObject(img);
    this.reapplyObjectStyles();

    if (fromUrl.type === 'shape') {
      const brightnessFilter = new fabric.filters.Brightness({
        brightness: 100 / 100, // Value between -1 (dark) and 1 (bright)
      });
      img.filters.push(brightnessFilter);
      img.applyFilters();
    }
    this.canvas.renderAll();
    this.saveState();

    this.itemList.unshift({
      id: uniqueId,
      type: 'image',
      name: fromUrl.name,
      visible: true
    });
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

  selectFont(font: string) {
    this.textfont = font;
    this.changeFont(font); // your existing method
    this.dropdownOpen = false;
  }


  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
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
  updateHeight(event: Event) {
    const target = event.target as HTMLInputElement;
    this.textHeight = Number(target.value);
    const height = (this.selectedText.height ?? 0) * this.textHeight / 50;
    // const clipPath = new fabric.Rect({
    //   left: 0,
    //   top: -(this.selectedText.height ?? 0) / 2,
    //   width: this.selectedText.width ?? 0,
    //   height: height,
    //   originX: 'center',
    //   originY: 'center',
    // });
    const clipPath = new fabric.Rect({
      left: 0,
      top: this.selectedText.height! / 2 - this.textHeight,
      width: this.selectedText.width ?? 0,
      height: height,
      originX: 'center',
      originY: 'top',
    });
    this.selectedText.clipPath = clipPath;
    this.canvas.requestRenderAll();
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

      const template = this.fabricTemplate?.[index];
      if (template) {
        this.addElement(templateCanvas, '', template.name);
        templateCanvas.renderAll()
      } else {
        console.warn(`Template not found for index: ${index}`);
      }

      // Ensure Fabric.js updates the canvas
      templateCanvas.renderAll();
    });
  }

  addPredefinedText(template: any) {
    this.addElement(this.canvas, template.text, template.id);
  }

  // Add Custom Text
  addCustomText() {
    this.addElement(this.canvas, 'text');
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
      if (newVisibility) {
        this.canvas.setActiveObject(target);
      }
      this.canvas.renderAll();
    }
  }

  deleteObject(itemId?: string): void {
    let target: any;

    if (itemId) {
      // Find object by ID
      target = this.canvas.getObjects().find((obj: any) => obj.id === itemId);
    } else {
      // Get currently selected object
      target = this.canvas.getActiveObject();
    }

    if (itemId) {
      this.itemList = this.itemList.filter((item: any) => item.id !== itemId);
    } else {
      itemId = target.id;
      this.itemList = this.itemList.filter((item: any) => item.id !== itemId);
    }

    if (!target) return;

    // Remove from canvas
    this.canvas.remove(target);

    // Discard selection if this was the active object
    if (this.canvas.getActiveObject() === target) {
      this.canvas.discardActiveObject();
    }


    // Clear selection refs if any of them point to the deleted object
    if (this.selectedText === target) this.selectedText = null;
    if (this.selectedImage === target) this.selectedImage = null;
    if (this.selectedShape === target) this.selectedShape = null;

    // Remove from itemList if it's a tracked ID


    this.canvas.renderAll();
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

  onImageTemplateClick(element: any, istemplate: any) {
    if (!istemplate) this.addElement(this.canvas, '', '', element);

    this.isLoading = true;
    if (istemplate) {
      if (element.doubleside) {
        this.setColor(element.teeColor);
        if (this.isCanvas1Visible) this.toggleCanvas();
        this.addElement(this.canvas, '', element.name, '');
        setTimeout(() => {
          this.toggleCanvas();
        }, 300)
        setTimeout(() => {
          this.addElement(this.canvas, '', element.name + '_front', '');
          this.canvas.requestRenderAll();
        }, 500);
        setTimeout(() => {
          this.toggleCanvas();
          this.isLoading = false;
        }, 700);
      } else {
        this.addElement(this.canvas, '', element.name, '');
        setTimeout(() => {
          this.isLoading = false;
        }, 300)
      }
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
      this.textHeight = this.selectedText.clipPath ? Math.round(this.selectedText.clipPath.height * 50 / (this.selectedText.height ?? 1)) : 100;
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
    const cut: any = 0;
    const formData = new FormData();
    formData.append('userId', this.userData._id);
    formData.append('user_Name', this.userData.user_Name);
    formData.append('designName', this.designName);
    formData.append('sellingPrice', this.priceRange);
    formData.append('creatorCut', cut);
    formData.append('role', this.userData.user_Role);
    formData.append('itemColor', this.imageColor);
    formData.append('description', 'Description of the design');

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
        this.back()
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setColor(id: any) {
    const canvasContainer = document.querySelector('.container') as HTMLElement;
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
    const targetEl = (event.target as HTMLElement);

    // if we tapped the close button (or something inside it), do nothing
    if (targetEl.closest('.close-drawer')) {
      return;
    }

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
    if (!this.dragging) return;

    this.dragging = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    const bottomOffset = window.innerHeight - this.drawerHeight;
    // Close if user dragged too close to the bottom
    if (bottomOffset > this.closeThreshold) {
      this.toggleDrawer(); // or this.toggleDrawer()
    }
    this.dragging = false;
    this.animationFrameId && cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  addSvg() {
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
    this.toggleDrawer();
  }

  toggleGrid() {
    if (this.gridGroup) {
      this.canvas.remove(this.gridGroup);
      this.gridGroup = undefined;
      this.canvas.renderAll();
      return;
    }

    const zoom = this.canvas.getZoom(); // e.g. 0.1
    const canvasWidth = this.canvas.getWidth() / zoom;
    const canvasHeight = this.canvas.getHeight() / zoom;

    // Columns still by inch
    const inchesWidth = 10.7;
    const ppiX = canvasWidth / inchesWidth;

    // Rows: exactly 17 boxes
    const rows = 17;
    const ppiY = canvasHeight / rows;

    const gridLines: fabric.Line[] = [];
    const halfPixel = 0.5;

    // Vertical lines (columns by inch)
    const cols = Math.ceil(canvasWidth / ppiX) + 1;
    for (let i = 0; i <= cols; i++) {
      const x = i * ppiX + halfPixel;
      gridLines.push(new fabric.Line([x, 0, x, canvasHeight], {
        stroke: 'black',
        selectable: false,
        evented: false,
        strokeWidth: 10,
        excludeFromExport: true,
      }));
    }

    // Horizontal lines (exactly 17 rows)
    for (let i = 0; i <= rows; i++) {
      const y = i * ppiY + halfPixel;
      gridLines.push(new fabric.Line([0, y, canvasWidth, y], {
        stroke: 'black',
        selectable: false,
        evented: false,
        strokeWidth: 10,
        excludeFromExport: true,
      }));
    }

    this.gridGroup = new fabric.Group(gridLines, {
      selectable: false,
      evented: false,
      originX: 'left',
      originY: 'top',
      hoverCursor: 'default',
      excludeFromExport: true,
    });

    this.canvas.add(this.gridGroup);

    // Move grid to back
    const objs = this.canvas.getObjects();
    const idx = objs.indexOf(this.gridGroup!);
    if (idx > -1) {
      objs.splice(idx, 1);
      objs.unshift(this.gridGroup!);
    }

    this.canvas.renderAll();
  }

  updateQualityStatus() {
    let newStatus: any = 'green';

    const redThresholdPx = 300;    // below 600px is red
    const yellowThresholdPx = 500; // below 900px is yellow

    const objects = this.canvas.getObjects().filter(obj =>
      obj.selectable && !obj.excludeFromExport && obj.type !== 'line'
    );

    for (const obj of objects) {
      const pixelWidth = (obj.width ?? 0) * (obj.scaleX ?? 1);
      const pixelHeight = (obj.height ?? 0) * (obj.scaleY ?? 1);

      if (pixelWidth < redThresholdPx || pixelHeight < redThresholdPx) {
        newStatus = 'red';
        break;
      } else if (pixelWidth < yellowThresholdPx || pixelHeight < yellowThresholdPx) {
        if (newStatus !== 'red') newStatus = 'yellow';
      }
    }

    this.qualityStatus = newStatus;
  }

  get isObjectSelected(): boolean {
    return !!(this.selectedText || this.selectedImage || this.selectedShape);
  }

  deleteSelectedObject(): void {
    if (this.selectedText) {
      this.canvas.remove(this.selectedText);
      this.selectedText = null;
    } else if (this.selectedImage) {
      this.canvas.remove(this.selectedImage);
      this.selectedImage = null;
    } else if (this.selectedShape) {
      this.canvas.remove(this.selectedShape);
      this.selectedShape = null;
    }
  }

  //for modals
  openModal(type: any) {
    let data = {
      dialogType: type,
      userType: this.userData.user_Role
    }
    this.modalDialog = this.matDialog.open(CreatePageModalComponent, {
      width: '450px',
      maxWidth: '90vw',
      // height: 'auto' is default, so the content dictates height
      autoFocus: false,
      restoreFocus: false,
      data: data,
    });

    this.modalDialog.afterClosed().subscribe((result) => {
      console.log('The dialog was closed', result);
      if (result) {
        if (type === 'save') {
          this.designName = result.name;
          this.priceRange = result.price;
          this.saveCanvasDataToDB()
        }
        if (type === 'add') {
          if (result == 'text') {
            this.addCustomText()
          } else {
            this.addElement(result)
          }
        }
      }
    });
  }

  back() {
    this.router.navigate(['/tees']);
  }
}
