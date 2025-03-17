import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonShopComponent } from './common-shop.component';

describe('CommonShopComponent', () => {
    let component: CommonShopComponent;
    let fixture: ComponentFixture<CommonShopComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CommonShopComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommonShopComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
