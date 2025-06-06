import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatePageComponent } from './create-page/create-page.component';
import { CommonShopComponent } from './common-shop/common-shop.component';
import { YourTeesComponent } from './your-tees/your-tees.component';
import { HomeComponent } from './home/home.component';
import { SettingPageComponent } from './setting-page/setting-page.component';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { MerchHomePageComponent } from './merch-home-page/merch-home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AdminHomePageComponent } from './admin-home-page/admin-home-page.component';
import { VendorDashboardComponent } from './vendor-dashboard/vendor-dashboard.component';
import { TshirtPreviewComponent } from './tshirt-preview/tshirt-preview.component';
import { TestComponentComponent } from './test-component/test-component.component';

export const routes: Routes = [
    { path: 'create', component: CreatePageComponent },
    { path: '', component: HomeComponent },
    { path: 'shop', component: CommonShopComponent },
    { path: 'tees', component: YourTeesComponent },
    { path: 'account', component: SettingPageComponent },
    { path: 'buy/:userId', component: BuyPageComponent },
    { path: ':userName/merch/:userId', component: MerchHomePageComponent },
    { path: 'refferedBy/:userName', component: HomeComponent },
    // GautamJha/merch/67d57c01135958e9180275f1
    //admin
    { path: 'admin', component: TshirtPreviewComponent },
    { path: 'test', component: TestComponentComponent },
    { path: 'order/:id', component: VendorDashboardComponent },

    // end
    { path: '**', component: NotFoundComponent },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
