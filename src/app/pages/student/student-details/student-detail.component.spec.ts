import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../../../core/service/student/student.service';
import { LoginService } from '../../../core/service/login/login.service';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Student } from '../../../core/models/Student';

describe('StudentFormComponent Unit Tests Suite', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;
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
      imports: [StudentDetailsComponent, ReactiveFormsModule],
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

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create student detail component', () => {
    expect(component).toBeTruthy();
  });
  
});