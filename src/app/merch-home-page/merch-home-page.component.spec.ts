import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchHomePageComponent } from './merch-home-page.component';

describe('MerchHomePageComponent', () => {
  let component: MerchHomePageComponent;
  let fixture: ComponentFixture<MerchHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MerchHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MerchHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
