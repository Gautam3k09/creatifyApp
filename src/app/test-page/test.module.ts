import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { AngularResizeEventModule } from 'angular-resize-event';
import { TestPageComponent } from './test-page.component';
import { DraggableDirective } from './draggable.directive';

@NgModule({
    declarations:[TestPageComponent,DraggableDirective],
    imports:[AngularResizeEventModule]
})

export class AppModule { }