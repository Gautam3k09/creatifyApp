import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularResizeEventModule } from 'angular-resize-event';
import { TestPageComponent } from './test-page/test-page.component';

@NgModule({
    declarations:[TestPageComponent],
    imports:[AngularResizeEventModule]
})

export class AppModule { }