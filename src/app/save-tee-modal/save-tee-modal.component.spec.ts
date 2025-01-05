import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveTeeModalComponent } from './save-tee-modal.component';

describe('SaveTeeModalComponent', () => {
  let component: SaveTeeModalComponent;
  let fixture: ComponentFixture<SaveTeeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveTeeModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SaveTeeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
