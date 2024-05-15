import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { AngularResizeEventModule } from 'angular-resize-event';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    declarations:[],
    imports:[CommonModule,AngularResizeEventModule,BrowserModule,FormsModule ]
})

export class AppModule { }