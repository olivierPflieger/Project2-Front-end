import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudentDetailsComponent } from './student-details.component';
import { StudentService } from '../../../core/service/student/student.service';
import { LoginService } from '../../../core/service/login/login.service';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Student } from '../../../core/models/Student';

describe('StudentFormComponent Unit Tests Suite', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;
  let loginServiceMock: jest.Mocked<LoginService>;

  beforeEach(async () => {
    // Mocks
    studentServiceMock = {
      create: jest.fn(),
      update: jest.fn(),
      findById: jest.fn()
    } as any;

    loginServiceMock = { } as any;
    studentServiceMock.findById.mockReturnValue(of({
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      birthDate: '2000-02-02'
    } as Student));

    await TestBed.configureTestingModule({
      imports: [StudentDetailsComponent, ReactiveFormsModule],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : null
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

  it('should display student details', () => {
    const textContent = fixture.nativeElement.textContent;

    expect(studentServiceMock.findById).toHaveBeenCalledWith(1);
    expect(textContent).toContain('Student Details');
    expect(textContent).toContain('John');
    expect(textContent).toContain('Doe');
    expect(textContent).toContain('john@test.com');
    expect(textContent).toContain('2000-02-02');
  });
  
});
