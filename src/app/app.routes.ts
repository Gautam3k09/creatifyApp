import { Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import { HeaderPageComponent } from './header-page/header-page.component';
import { CanvasAreaComponent } from './canvas-area/canvas-area.component';
import { CommonShopComponent } from './common-shop/common-shop.component';
import { YourTeesComponent } from './your-tees/your-tees.component';
import { HomeComponent } from './home/home.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { BuyPageComponent } from './buy-page/buy-page.component';

export const routes: Routes = [
    // { path: '', component: HeaderPageComponent},
    { path: '', component: HomeComponent},
    { path: 'shop', component: CommonShopComponent},
    { path: 'tees', component: YourTeesComponent},
    { path: 'test', component:  TestPageComponent},
    { path: 'canvas',component: CanvasAreaComponent},
    { path: 'settings', component: SettingPageComponent},
    { path: 'buy', component: BuyPageComponent}
];
