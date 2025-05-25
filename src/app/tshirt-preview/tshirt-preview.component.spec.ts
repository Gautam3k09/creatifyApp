import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TshirtPreviewComponent } from './tshirt-preview.component';

describe('TshirtPreviewComponent', () => {
  let component: TshirtPreviewComponent;
  let fixture: ComponentFixture<TshirtPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TshirtPreviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TshirtPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
