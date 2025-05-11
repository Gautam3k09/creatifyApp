import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HeaderPageComponent } from '../header-page/header-page.component';
import { FooterComponent } from '../footer/footer.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { localStorageService } from '../local-storage-service';
import { CommonModule } from '@angular/common';
import { trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [HeaderPageComponent, CommonModule, FooterComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    animations: [
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(100%)', opacity: 0 }),
                animate('400ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
            ])
        ])
    ]
})
export class HomeComponent {
    @ViewChild('bgVideo') bgVideo!: ElementRef<HTMLVideoElement>;
    @ViewChildren('cardRef', { read: ElementRef }) cards!: QueryList<ElementRef>;

    sentences: any = [
        "Why settle for someone else’s style? Upload your artwork, and let Createefi turn your design into the perfect oversized tee.",
        "Turn your designs into merch! Create your store with Createefi. Upload your designs—we'll handle printing and fulfillment.",
        "The Practice of expressing creativity through personalized fashion, turning unique ideas into wearable art.",
    ];
    currentSentenceIndex = 0;
    currentSentence = this.sentences[this.currentSentenceIndex];
    show = true;

    dialogConfig = new MatDialogConfig();
    modalDialog: MatDialogRef<LoginModalComponent, any> | undefined;
    isLogin: any = false;
    storedData: any;
    images: string[] = [
        'assets/home-page-display/untitled.png',
        'assets/home-page-display/white-createefi.png',
    ];
    currentIndex: number = 0;
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
        setInterval(() => {
            this.show = false; // Triggers leave
        }, 3000);
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
        if (this.storedData && this.storedData.visitor != null) {
            this.localStorage.removeUserLocalStorage();
            location.reload();
        }
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
        let width = window.innerWidth;
        if (width > 600) {
            this.dialogConfig.width = '25%';
        } else {
            this.dialogConfig.width = '80%';
        }
        this.dialogConfig.id = 'projects-modal-component';
        this.dialogConfig.height = 'auto';
        this.modalDialog = this.dialog.open(LoginModalComponent, this.dialogConfig);
    }

    ngAfterViewInit() {
        this.updateDots(0);
        const carousel = document.getElementById('carousel')!;
        carousel.addEventListener('scroll', () => {
            this.detectActiveCard(carousel.scrollLeft);
        });

        const video = this.bgVideo.nativeElement;
        video.muted = true;
        video.play().then(() => {
            console.log('Autoplay success!');
        }).catch((err) => {
            console.error('Autoplay blocked:', err);
        });
    }

    detectActiveCard(scrollLeft: number) {
        const cardArray = this.cards.toArray();
        let closestIndex = 0;
        let minDiff = Infinity;

        cardArray.forEach((card, i) => {
            const offsetLeft = card.nativeElement.offsetLeft;
            const diff = Math.abs(offsetLeft - scrollLeft);
            if (diff < minDiff) {
                minDiff = diff;
                closestIndex = i;
            }
        });

        this.updateDots(closestIndex);
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

    onAnimationDone() {
        // After leave animation
        if (!this.show) {
            this.currentSentenceIndex = (this.currentSentenceIndex + 1) % this.sentences.length;
            this.currentSentence = this.sentences[this.currentSentenceIndex];
            this.show = true; // Triggers enter
        }
    }

    ngOnDestroy() {

    }
}

