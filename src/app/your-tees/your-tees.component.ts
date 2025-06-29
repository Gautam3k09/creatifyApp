import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AppServiceService } from '../app-service.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { TshirtsDataPageComponent } from '../tshirts-data-page/tshirts-data-page.component';
import { localStorageService } from '../local-storage-service';

@Component({
    selector: 'app-your-tees',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TshirtsDataPageComponent,
    ],
    providers: [AppServiceService, BsModalService],
    templateUrl: './your-tees.component.html',
    styleUrl: './your-tees.component.css',
})
export class YourTeesComponent {
    @Input() isMerchHomePage: any = false;
    modalRef?: BsModalRef;
    teesCount: any = 0;
    storedData: any;

    constructor(
        private router: Router,
        private appservice: AppServiceService,
        public localStorage: localStorageService
    ) {
        this.storedData = this.localStorage.getUserLocalStorage();
    }

    ngOnInit() {
        this.getTees();
    }

    getTees() {
        let id: any = this.storedData;
        id = this.storedData;
        const data = {
            id: id._id,
        };
        this.appservice.getItems(data).subscribe((result) => {
            if (result && result.data) {
                this.teesCount = result.data.length;
            }
        });
    }

    openCanvas(string: any) {
        this.router.navigate([string]);
    }
}
