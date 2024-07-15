import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { AngularResizeEventModule } from 'angular-resize-event';
import { BrowserModule } from '@angular/platform-browser';
import { DataService } from './data-service.service';
import { BuyPageComponent } from './buy-page/buy-page.component';
import { YourTeesComponent } from './your-tees/your-tees.component';

@NgModule({
    declarations:[],
    imports:[CommonModule,AngularResizeEventModule,BrowserModule,FormsModule,YourTeesComponent,BuyPageComponent ],
    providers:[DataService ]
})

export class AppModule { }