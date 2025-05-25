import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppServiceService } from '../app-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { localStorageService } from '../local-storage-service';
import { environment } from '../../../environment';
import { LoaderComponent } from '../loader/loader.component';
import { HeaderPageComponent } from "../header-page/header-page.component";

@Component({
    selector: 'app-tshirts-data-page',
    standalone: true,
    imports: [CommonModule, LoaderComponent, HeaderPageComponent],
    templateUrl: './tshirts-data-page.component.html',
    styleUrl: './tshirts-data-page.component.css',
})
export class TshirtsDataPageComponent {
    @Input() from: any;
    userId: any;
    teeDatas: any = [];
    commonShop: any = '';
    pageCount: number = 1;
    DataFetched: boolean = false;
    userData: any;
    storedData: any;
    hideLoadbtn: boolean = false;
    isLoading = false;
    imageFrontUrls = [
        { key: 'Onyx black', value: 'assets/Tees/black-f.png' },
        { key: 'Pearl white', value: 'assets/Tees/white-f.png' },
        { key: 'Sapphire blue', value: 'assets/Tees/blue-f.png' },
        { key: 'Ruby maroon', value: 'assets/Tees/maroon-f.png' },
    ];
    imageBackUrls = [
        { key: 'Onyx black', value: 'assets/Tees/black-b.png' },
        { key: 'Pearl white', value: 'assets/Tees/white-b.png' },
        { key: 'Sapphire blue', value: 'assets/Tees/blue-b.png' },
        { key: 'Ruby maroon', value: 'assets/Tees/maroon-b.png' },
    ];

    wasabiUrl = environment.wasabiUrl;

    constructor(
        public appservice: AppServiceService,
        private router: Router,
        public route: ActivatedRoute,
        public localstorage: localStorageService
    ) {
        this.userId = route.snapshot.params['userId'];
        this.storedData = this.localstorage.getUserLocalStorage();
        if (this.storedData && this.storedData.LoggedIn != null) {
            this.userData = JSON.parse(this.storedData.userData);
        }
        this.wasabiUrl = environment.wasabiUrl;
    }

    async ngOnInit() {
        this.isLoading = true;
        await this.getTees();
        this.isLoading = false;
    }

    async getTees() {
        try {
            if (this.from !== 'personal') {
                const data = {
                    pageNumber: this.pageCount,
                };

                const result = await this.appservice.getAlltees(data).toPromise();
                if (result) {
                    if (result.data.length < 1) {
                        this.DataFetched = true;
                        return;
                    }
                    if (result.data.length < 12) {
                        this.hideLoadbtn = true;
                    }
                    this.teeDatas = this.teeDatas === '' ? result.data : this.teeDatas.concat(result.data);
                    if (this.teeDatas.length > 0) {
                        this.mapTeesData();
                        this.isLoading = false;
                    }
                }
            } else {
                let data: any;
                if (this.from === 'personal' && !this.storedData.visitor) {
                    data = { id: this.userData.user_Name };
                } else {
                    data = { id: this.userId };
                }

                const result = await this.appservice.getTees(data).toPromise();
                if (result) {
                    this.teeDatas = result.data;
                    this.mapTeesData();
                    this.isLoading = false;
                }
            }

            this.pageCount += 1;
        } catch (error) {
            console.error("Error fetching tees:", error);
        }
    }

    deleteTees(data: any) {
        this.appservice.deleteTees({ _id: data }).subscribe((res) => {
            this.teeDatas.forEach((element: any, index: any) => {
                if (element._id === data) this.teeDatas.splice(index, 1);
            });
        });
    }

    navigateBuyPage(teeData: any) {
        if (this.storedData != null || this.storedData.Visitor == '') {
            this.router.navigate(['/buy/' + teeData._id]);
        }
    }

    copytext(teeDataId: string) {
        console.log('teeDataId', teeDataId);
        if (navigator.share) {
            navigator.share({
                title: 'Check out my Oversized Tee!',
                text: `I just ordered this from Createefi!`,
                url: environment.frontend + 'buy/' + teeDataId
            }).catch((err) => {
                console.error('Sharing failed:', err);
            });
        } else {
            alert('Sharing not supported on this device.');
        }
    }

    openCanvas(string: any) {
        this.router.navigate([string]);
    }

    mapTeesData() {
        this.teeDatas = this.teeDatas.map((item: any) => {
            let url;
            if (item.teeUrl_FrontsideImg != "") {
                url = this.imageFrontUrls.find(img => img.key === item.tee_Color);
                item.img = item.teeUrl_FrontsideImg;
            } else if (item.teeUrl_BacksideImg != "") {
                url = this.imageBackUrls.find(img => img.key === item.tee_Color);
                item.img = item.teeUrl_BacksideImg;
            } else {
                url = this.imageFrontUrls.find(img => img.key === item.tee_Color);
                item.img = ""
            }
            item.teeSrc = url?.value || '';
            return item;
        });
    }
}
