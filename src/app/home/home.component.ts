import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeaderPageComponent, FooterComponent, CommonModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
})
export class HomeComponent {
    @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;

    sentence: any = [
        "Why settle for someone else’s style? Upload your artwork, and let Createefi turn your design into the perfect oversized tee.",
        "Turn your designs into merch! Create your store with Createefi. Upload your designs—we'll handle printing and fulfillment.",
        "The Practice of expressing creativity through personalized fashion, turning unique ideas into wearable art.",
    ]

    dialogConfig = new MatDialogConfig();
    modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
    isLogin: any = false;
    storedData: any;
    images: string[] = [
        'assets/home-page-display/untitled.png',
        'assets/home-page-display/white-createefi.png',
    ];
    currentSlide: number = 0;
    currentIndex: number = 0;
    intervalId: any;
    isSwitching = false;

    products = [
        {
            img: '../../assets/createefi/white.png',
            alt: 'White Tee',
            name: 'First Expression',
            colorName: 'Pearl White',
            price: 'Rs. 549',
            activeColor: 'white'
        },
        {
            img: '../../assets/createefi/black.png',
            alt: 'Black Tee',
            name: 'Createefi Eclipse',
            colorName: 'Onyx Black',
            price: 'Rs. 549',
            activeColor: 'black'
        },
        {
            img: '../../assets/createefi/blue.png',
            alt: 'Blue Tee',
            name: 'Last Puff',
            colorName: 'Sapphire Blue',
            price: 'Rs. 549',
            activeColor: 'blue'
        },
        {
            img: '../../assets/createefi/maroon.png',
            alt: 'Maroon Tee',
            name: 'Bruised Velvet',
            colorName: 'Ruby Maroon',
            price: 'Rs. 549',
            activeColor: 'maroon'
        }
    ];
    colors = ['white', 'black', 'blue', 'maroon'];

    constructor(
        private dialog: MatDialog,
        private router: Router,
        public localStorage: localStorageService,
        route: ActivatedRoute
    ) {
        this.storedData = localStorage.getUserLocalStorage();
        if (this.storedData && this.storedData.visitor == null) {
            this.isLogin = this.storedData.LoggedIn;
        } else {
            this.isLogin = false;
            let userName = route.snapshot.params['userName'];
            if (userName) {
                this.openCreate(userName);
            }
        }
    }

    ngOnInit() {
        this.startSentence();
        if (this.storedData && this.storedData.visitor != null) {
            this.localStorage.removeUserLocalStorage();
            location.reload();
        }
    }

    startSentence() {
        this.sentence.push(this.sentence[0]);
        this.intervalId = setInterval(() => {
            this.currentIndex++;
            if (this.currentIndex === this.sentence.length - 1) {
                setTimeout(() => {
                    this.currentIndex = 0;
                }, 500);
            }
        }, 3000);
    }
    openCreate(name: any = '') {
        if (!this.isLogin) {
            this.openModal(name);
        } else {
            this.router.navigate(['/tees']);
        }
    }

    openExplore() {
        if (!this.isLogin) {
            this.openModal();
        } else {
            this.router.navigate(['/shop']);
        }
    }

    openModal(name: any = '') {
        this.dialogConfig.id = 'projects-modal-component';
        this.dialogConfig.height = '500px';
        this.dialogConfig.width = '650px';
        this.dialogConfig.data = name;
        this.modalDialog = this.dialog.open(LoginModalComponent, this.dialogConfig);
    }

    ngAfterViewInit() {
        this.updateDots(0);
        const video = this.bgVideo.nativeElement;
        video.muted = true;
        video.play().then(() => {
            console.log('Autoplay success!');
        }).catch((err) => {
            console.error('Autoplay blocked:', err);
        });
    }

    scrollToCard(index: number) {
        const carousel = document.getElementById('carousel') as HTMLElement;
        const cardWidth = carousel.children[0].clientWidth + 20;
        carousel.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
        this.updateDots(index);
    }

    updateDots(index: number) {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    ngOnDestroy() {
        clearInterval(this.intervalId);
    }
}

