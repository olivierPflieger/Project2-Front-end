import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentFormComponent } from './student-form.component';
import { StudentService } from '../../../core/service/student/student.service';
import { LoginService } from '../../../core/service/login/login.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Student } from '../../../core/models/Student';

describe('StudentFormComponent Unit Tests Suite', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;
  let loginServiceMock: jest.Mocked<LoginService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    // Mocks
    studentServiceMock = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn()
    } as any;

    loginServiceMock = { } as any;

    routerMock = { navigate: jest.fn() } as any;

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, ReactiveFormsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        { provide: Router, useValue: routerMock },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => null // default : creation mode
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create student form component', () => {
    expect(component).toBeTruthy();
  });

  it('should submit student form and call create on success (creation mode)', () => {
    
    component.isEditMode = false; // création
    
    const formValue: Student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };

    const outputValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };
    component.studentForm.setValue(outputValues);

    studentServiceMock.create.mockReturnValue(of(new HttpResponse({ status: 201, body: formValue })));

    component.onSubmit();

    expect(studentServiceMock.create).toHaveBeenCalledWith(outputValues);
    expect(component.message).toBe('Student created successfully');
    expect(component.messageType).toBe('success');
  });

  it('should submit student form and call update on success (edit mode)', () => {
    
    component.isEditMode = true;
    
    const formValue: Student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };
    
    const outputValues = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };
    component.studentForm.setValue(outputValues);

    studentServiceMock.update.mockReturnValue(of(new HttpResponse({ status: 200, body: formValue })));

    component.onSubmit();
    
    expect(component.message).toBe('Student updated successfully');
    expect(component.messageType).toBe('success');
  });

  it('should display error when create fails', () => {
    component.isEditMode = false;
    
    const formValue: Student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };
    component.studentForm.setValue({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      birthDate: formValue.birthDate
    });
        
    studentServiceMock.create.mockReturnValue(
      throwError(() => ({
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'User with email John@test.com already exists' }
      }))
    );

    component.onSubmit();

    expect(component.message).toBe('User with email John@test.com already exists');
    expect(component.messageType).toBe('error');
  });

  it('should display error when update fails', () => {
    component.isEditMode = true;
    component.studentId = 999;

    const formValue: Student = {
      id: 999,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };

    component.studentForm.setValue({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      birthDate: formValue.birthDate
    });

    studentServiceMock.update.mockReturnValue(
      throwError(() => ({
        status: 404,
        statusText: 'Not Found',
        error: { message: 'Student not found' }
      }))
    );

    component.onSubmit();

    expect(studentServiceMock.update).toHaveBeenCalledWith(formValue);
    expect(component.message).toBe('Student not found');
    expect(component.messageType).toBe('error');
  });
  
  it('should not submit when form is completely empty', () => {
    component.studentForm.setValue({
      firstName: '',
      lastName: '',
      email: '',
      birthDate: ''
    });

    component.onSubmit();

    expect(studentServiceMock.create).not.toHaveBeenCalled();
    expect(studentServiceMock.update).not.toHaveBeenCalled();
  });

  it.each([
    ['firstName'],
    ['lastName'],
    ['email'],
    ['birthDate']
  ])('should not submit when %s is empty', (field) => {
    const formValue: any = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'jdoe@test.com',
      birthDate: '2000-01-01'
    };
    formValue[field] = '';

    component.studentForm.setValue(formValue);

    component.onSubmit();

    expect(studentServiceMock.create).not.toHaveBeenCalled();
    expect(studentServiceMock.update).not.toHaveBeenCalled();
  });

  it('should reset the form and set submitted to false', () => {
    component.submitted = true;

    const formValue: Student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'John@test.com',
      birthDate: '2000-02-02'
    };
    component.studentForm.setValue({
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      birthDate: formValue.birthDate
    });

    component.onReset();

    expect(component.submitted).toBe(false);
    expect(component.studentForm.value).toEqual({
      firstName: null,
      lastName: null,
      email: null,
      birthDate: null
    });
  });

});
