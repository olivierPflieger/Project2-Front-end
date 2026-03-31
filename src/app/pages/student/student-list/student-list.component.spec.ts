import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Student } from '../../../core/models/Student';
import { LoginService } from '../../../core/service/login/login.service';
import { StudentService } from '../../../core/service/student/student.service';
import { StudentListComponent } from './student-list.component';

describe('StudentListComponent Unit Tests Suite', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;
  let loginServiceMock: jest.Mocked<LoginService>;
  let studentsMock: Student[];

  beforeEach(async () => {
    studentsMock = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@test.com',
        birthDate: '2000-02-02'
      },
      {
        id: 2,
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@test.com',
        birthDate: '2001-03-03'
      }
    ];

    studentServiceMock = {
      getAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    loginServiceMock = {} as any;

    studentServiceMock.getAll.mockReturnValue(
      of(new HttpResponse({ status: 200, body: studentsMock }))
    );

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create student list component', () => {
    expect(component).toBeTruthy();
  });

  it('should display a list of students', () => {
    const textContent = fixture.nativeElement.textContent;
    const studentItems = fixture.nativeElement.querySelectorAll('ul li');

    expect(studentServiceMock.getAll).toHaveBeenCalled();
    expect(component.students).toEqual(studentsMock);
    expect(studentItems.length).toBe(2);
    expect(textContent).toContain('John');
    expect(textContent).toContain('Doe');
    expect(textContent).toContain('john@test.com');
    expect(textContent).toContain('2000-02-02');
    expect(textContent).toContain('Jane');
    expect(textContent).toContain('Smith');
    expect(textContent).toContain('jane@test.com');
    expect(textContent).toContain('2001-03-03');
  });
});
