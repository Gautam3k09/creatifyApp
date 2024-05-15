import { Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { CanvasAreaComponent } from './canvas-area/canvas-area.component';
import { StoreComponent } from './store/store.component';
import { CommonShopComponent } from './common-shop/common-shop.component';
import { YourTeesComponent } from './your-tees/your-tees.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    // { path: '', component: HeaderPageComponent},
    { path: '', component: HomeComponent},
    { path: 'shop', component: CommonShopComponent},
    { path: 'tees', component: YourTeesComponent},
    { path: 'store', component: StoreComponent},
    { path: 'test', component:  TestPageComponent},
    { path: 'canvas',component: CanvasAreaComponent},
];
