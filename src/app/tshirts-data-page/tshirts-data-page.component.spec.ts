import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TshirtsDataPageComponent } from './tshirts-data-page.component';

describe('TshirtsDataPageComponent', () => {
  let component: TshirtsDataPageComponent;
  let fixture: ComponentFixture<TshirtsDataPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TshirtsDataPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TshirtsDataPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
