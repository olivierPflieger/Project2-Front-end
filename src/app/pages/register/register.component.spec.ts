import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../../core/service/user.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Register } from '../../core/models/Register';

describe('RegisterComponent Unit Tests Suite', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceMock: jest.Mocked<UserService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    // Mocks
    userServiceMock = { register: jest.fn() } as any;
    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
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

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create register component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit register form and navigate to login on success', () => {
    
    const formValue = { firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'pass' };
    component.registerForm.setValue(formValue);
    
    userServiceMock.register.mockReturnValue(
      of(new HttpResponse({
        status: 201, body: { firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'pass' }
      }))
    );
        
    component.onSubmit();

    expect(userServiceMock.register).toHaveBeenCalledWith(formValue);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    
  });
  
  it('should display error when Login already exists', () => {
    const formValue: Register = { firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'pass' };
    component.registerForm.setValue(formValue);
    const errorBody = { message: 'User with login jdoe already exists' };
    userServiceMock.register.mockReturnValue(
      throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: errorBody
      }))
    );
    
    component.onSubmit();

    expect(component.message).toBe('User with login jdoe already exists');
    expect(component.messageType).toBe('error');
  });

  it('should not submit when form is completely empty', () => {
    component.registerForm.setValue({
      firstName: '',
      lastName: '',
      login: '',
      password: ''
    });

    component.onSubmit();

    expect(userServiceMock.register).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
  
  it.each([
    ['firstName'],
    ['lastName'],
    ['login'],
    ['password']
  ])('should not submit when %s is empty', (field) => {
    const formValue: any = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'jdoe',
      password: 'pass'
    };
    
    formValue[field] = '';

    component.registerForm.setValue(formValue);

    component.onSubmit();

    expect(userServiceMock.register).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should reset the form and set submitted to false', () => {

    component.submitted = true;

    const formValue: Register = { firstName: 'John', lastName: 'Doe', login: 'jdoe', password: 'pass' };
    component.registerForm.setValue(formValue);
    
    component.onReset();

    expect(component.submitted).toBe(false);

    expect(component.registerForm.value).toEqual({
      firstName: null,
      lastName: null,
      login: null,
      password: null
    });
  });
});
