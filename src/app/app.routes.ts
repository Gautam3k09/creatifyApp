import { Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { CanvasAreaComponent } from './canvas-area/canvas-area.component';

export const routes: Routes = [
    { path: '', component: HeaderPageComponent},
    { path: 'test', component:  TestPageComponent},
    { path: 'canvas',component: CanvasAreaComponent},
];
