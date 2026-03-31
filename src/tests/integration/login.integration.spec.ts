import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from '../../app/pages/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../../app/core/service/login/login.service';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { Login } from '../../app/core/models/Login';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('LoginComponent Integration Tests', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let loginService: LoginService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,        
        ReactiveFormsModule
      ],
      providers: [
        LoginService,
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;    
    loginService = TestBed.inject(LoginService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {    
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    
    const loginUser: Login = { login: 'keryss', password: 'keryss' };
    console.log(loginUser)
    
    loginService.login(loginUser)      
      .subscribe({
        next: (res) => {
          console.log('what ?')
          const token = res.body?.token.toString();
          if (token) {
            console.log('token :' + token);
          }
          done();                
        },
        error: (err) => {
          console.log('what 2?')
          if (err.error && err.error.message) {
            console.log('err1 :' + err.error.message);
          } else {
            console.log('err2 :' + err.error);
          } 
          done();         
        }
      });

    const user = loginService.getUserName();
    console.log('User:', user);
  });
    
});