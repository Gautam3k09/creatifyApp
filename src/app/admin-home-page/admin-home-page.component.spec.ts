import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHomePageComponent } from './admin-home-page.component';

describe('AdminHomePageComponent', () => {
    let component: AdminHomePageComponent;
    let fixture: ComponentFixture<AdminHomePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AdminHomePageComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminHomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
