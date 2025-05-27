import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  CanvasTexture,
  MeshBasicMaterial,
  Clock,
  Color
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-tshirt-preview',
  standalone: true,
  templateUrl: './tshirt-preview.component.html',
  styleUrls: ['./tshirt-preview.component.css']
})
export class TshirtPreviewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('threeContainer', { static: true }) threeContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('designCanvas', { static: true }) designCanvas!: ElementRef<HTMLCanvasElement>;

  private scene!: Scene;
  private camera!: PerspectiveCamera;
  private renderer!: WebGLRenderer;
  private controls!: OrbitControls;
  private clock = new Clock();
  private designTexture!: CanvasTexture;

  ngAfterViewInit() {
    this.initThree();
    this.setupDesignCanvas();
    this.loadModelAndApplyTexture();
    this.animate();
  }

  private initThree() {
    this.scene = new Scene();
    this.scene.background = new Color(0x333333);
    const width = this.threeContainer.nativeElement.clientWidth;
    const height = this.threeContainer.nativeElement.clientHeight;
    this.camera = new PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.5, 3);

    this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.threeContainer.nativeElement.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 5;
  }

  private setupDesignCanvas() {
    const canvas = this.designCanvas.nativeElement;
    canvas.width = 1024;
    canvas.height = 1024;

    const ctx = canvas.getContext('2d')!;

    // Optional: Add light gray background if needed
    ctx.fillStyle = 'rgba(147, 147, 147, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw white T-shirt area or placeholder (simulate it for visibility)
    ctx.fillStyle = 'rgba(147, 147, 147, 1)';
    ctx.strokeStyle = 'rgba(147, 147, 147, 1)';
    ctx.lineWidth = 10;

    // Example: Centered shirt shape area (rectangle)
    const padding = 100;
    const shirtWidth = canvas.width - 2 * padding;
    const shirtHeight = canvas.height - 2 * padding;

    ctx.fillRect(padding, padding, shirtWidth, shirtHeight);
    ctx.strokeRect(padding, padding, shirtWidth, shirtHeight); // Add border

    // Create texture from this canvas
    this.designTexture = new CanvasTexture(canvas);
    this.designTexture.needsUpdate = true;
  }


  private loadModelAndApplyTexture() {
    const loader = new GLTFLoader();
    // <-- Load your .glb here
    loader.load('assets/gltfs/test2.glb', (gltf) => {
      const model = gltf.scene;
      this.scene.add(model);

      // Traverse and apply the canvas texture
      model.traverse((child: any) => {
        if (child.isMesh) {
          // ensure material is basic so it shows the texture unlit
          child.material = new MeshBasicMaterial({ map: this.designTexture });
          child.material.needsUpdate = true;
        }
      });
    }, undefined, (err) => {
      console.error('Error loading .glb:', err);
    });
  }

  /** Call this when user draws on the designCanvas */
  public updateDesign(drawCallback: (ctx: CanvasRenderingContext2D) => void) {
    const ctx = this.designCanvas.nativeElement.getContext('2d')!;
    ctx.clearRect(0, 0, this.designCanvas.nativeElement.width, this.designCanvas.nativeElement.height);
    drawCallback(ctx);
    this.designTexture.needsUpdate = true;
  }

  private animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy() {
    this.renderer.dispose();
    this.designTexture.dispose();
  }
}
