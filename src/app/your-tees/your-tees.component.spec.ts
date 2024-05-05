import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourTeesComponent } from './your-tees.component';

describe('YourTeesComponent', () => {
  let component: YourTeesComponent;
  let fixture: ComponentFixture<YourTeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourTeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(YourTeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
