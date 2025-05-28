import { Component } from '@angular/core';
import { PolicyModalComponent } from './policy-modal/policy-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css',
})
export class FooterComponent {

    modalDialog: MatDialogRef<PolicyModalComponent, any> | undefined;

    constructor(public matDialog: MatDialog,) { }

    openModal(type: any) {
        let data = {
            dialogType: type,
        }
        this.modalDialog = this.matDialog.open(PolicyModalComponent, {
            width: '450px',
            maxWidth: '90vw',
            // height: 'auto' is default, so the content dictates height
            autoFocus: false,
            restoreFocus: false,
            data: data,
        });

        this.modalDialog.afterClosed().subscribe((result) => {
            console.log('The dialog was closed', result);
        });
    }

}
