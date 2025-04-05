import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularResizeEventModule } from 'angular-resize-event';
import { BrowserModule } from '@angular/platform-browser';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { YourTeesComponent } from './your-tees/your-tees.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        AngularResizeEventModule,
        BrowserModule,
        FormsModule,
        YourTeesComponent,
        BuyPageComponent,
        ModalModule.forRoot(),
        MatFormFieldModule,
        RouterModule.forRoot(routes),
    ],
    providers: [BsModalService],
})
export class AppModule { }
