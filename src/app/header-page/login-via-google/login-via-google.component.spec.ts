import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginViaGoogleComponent } from './login-via-google.component';

describe('LoginViaGoogleComponent', () => {
  let component: LoginViaGoogleComponent;
  let fixture: ComponentFixture<LoginViaGoogleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginViaGoogleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginViaGoogleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
