import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderPageComponent } from './admin-order-page.component';

describe('AdminOrderPageComponent', () => {
  let component: AdminOrderPageComponent;
  let fixture: ComponentFixture<AdminOrderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminOrderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
