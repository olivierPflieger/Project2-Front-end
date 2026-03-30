import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoginService } from './core/service/login/login.service';
import { RouterOutlet } from '@angular/router';

describe('AppComponent Unit Tests Suite', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginServiceMock: jest.Mocked<LoginService>;

  beforeEach(async () => {
    // 🔹 Mock de LoginService
    loginServiceMock = {
      isTokenExpired: jest.fn(),
      logout: jest.fn()
    } as any;

    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterOutlet],
      providers: [
        { provide: LoginService, useValue: loginServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });