import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TestPageComponent } from './test-page/test-page.component';
import { CreatePageComponent } from './create-page/create-page.component';
import { CommonShopComponent } from './common-shop/common-shop.component';
import { YourTeesComponent } from './your-tees/your-tees.component';
import { HomeComponent } from './home/home.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { MerchHomePageComponent } from './merch-home-page/merch-home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { AdminOrderPageComponent } from './admin-order-page/admin-order-page.component';

export const routes: Routes = [
    { path: 'create', component: CreatePageComponent },
    { path: '', component: HomeComponent },
    { path: 'shop', component: CommonShopComponent },
    { path: 'tees', component: YourTeesComponent },
    { path: 'test', component: TestPageComponent },
    { path: 'account', component: SettingPageComponent },
    { path: 'buy/:userId', component: BuyPageComponent },
    { path: ':userName/merch/:userId', component: MerchHomePageComponent },
    { path: 'refferedBy/:userName', component: HomeComponent },

    //admin
    { path: 'admin', component: AdminHomePageComponent },
    { path: 'order', component: AdminOrderPageComponent },

    // end
    { path: '**', component: NotFoundComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
