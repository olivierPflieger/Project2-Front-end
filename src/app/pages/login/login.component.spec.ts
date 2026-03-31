import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService } from '../../core/service/login/login.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Login } from '../../core/models/Login';

describe('LoginComponent Unit Tests Suite', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceMock: jest.Mocked<LoginService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    // Mocks
    loginServiceMock = { login: jest.fn() } as any;
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            params: of({}),
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit login form and navigate to home on success', () => {
        
    component.loginForm.setValue({
      login: 'jdoe',
      password: 'pass'
    });

    loginServiceMock.login.mockReturnValue(
      of(new HttpResponse({
        status: 200,
        body: { token: 'fake-jwt-token' }
      }))
    );

    component.onSubmit();

    expect(loginServiceMock.login).toHaveBeenCalledWith({
        login: 'jdoe',
        password: 'pass'

      });
  });

  it('should return error on failed login', () => {

      const formValue: Login = { login: 'jdoe', password: 'pass' };
      component.loginForm.setValue(formValue);        
      const errorBody = { message: 'Login or password incorrect' };

      loginServiceMock.login.mockReturnValue(throwError(() => ({
          status: 400,
          statusText: 'Bad Request',
          error: errorBody
      })));
      
      component.onSubmit();

      expect(component.message).toBe('Login or password incorrect');
      expect(component.messageType).toBe('error');
  });

  it('should not submit when form is completely empty', () => {
    component.loginForm.setValue({
      login: '',
      password: ''
    });

    component.onSubmit();

    expect(loginServiceMock.login).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it.each([    
    ['login'],
    ['password']
  ])('should not submit when %s is empty', (field) => {
    const formValue: any = {       
      login: 'jdoe',
      password: 'pass'
    };
    
    formValue[field] = '';

    component.loginForm.setValue(formValue);

    component.onSubmit();

    expect(loginServiceMock.login).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should reset the form and set submitted to false', () => {
  
    component.submitted = true;

    const formValue: Login = { login: 'jdoe', password: 'pass' };
    component.loginForm.setValue(formValue);
    
    component.onReset();

    expect(component.submitted).toBe(false);

    expect(component.loginForm.value).toEqual({
      login: null,
      password: null
    });
  });
    
});
