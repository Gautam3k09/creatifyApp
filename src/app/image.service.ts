// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ImageService {
//   private imageSource = new BehaviorSubject<string | ArrayBuffer | null>(null);
//   currentImage = this.imageSource.asObservable();

//   private widthSource = new BehaviorSubject<number>(0);
//   currentWidth = this.widthSource.asObservable();

//   private heightSource = new BehaviorSubject<number>(0);
//   currentHeight = this.heightSource.asObservable();

//   constructor() { }

//   changeImage(image: string | ArrayBuffer | null) {
//     this.imageSource.next(image);
//   }

//   changeWidth(width: number) {
//     this.widthSource.next(width);
//   }

//   changeHeight(height: number) {
//     this.heightSource.next(height);
//   }
// }
