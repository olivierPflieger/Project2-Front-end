import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { Student } from '../../../core/models/Student';
import { LoginService } from '../../../core/service/login/login.service';
import { StudentService } from '../../../core/service/student/student.service';
import { StudentListComponent } from './student-list.component';

@Component({
  standalone: true,
  template: ''
})
class DummyStudentDetailsComponent {}

@Component({
  standalone: true,
  template: ''
})
class DummyStudentFormComponent {}

describe('StudentListComponent Unit Tests Suite', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentServiceMock: jest.Mocked<StudentService>;
  let loginServiceMock: jest.Mocked<LoginService>;
  let studentsMock: Student[];
  let router: Router;
  let location: Location;

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
    studentServiceMock.delete.mockReturnValue(
      of(new HttpResponse({ status: 200 }))
    );

    await TestBed.configureTestingModule({
      imports: [StudentListComponent],
      providers: [
        { provide: StudentService, useValue: studentServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        provideRouter([
          {
            path: 'students/:id/details',
            component: DummyStudentDetailsComponent
          },
          {
            path: 'students/new',
            component: DummyStudentFormComponent
          },
          {
            path: 'students/:id/edit',
            component: DummyStudentFormComponent
          }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.initialNavigation();

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

  it('should navigate to student details when clicking on the first details link', async () => {
    const detailsLinks = fixture.nativeElement.querySelectorAll('[data-cy="studentlist-a-details"]');

    detailsLinks[0].click();
    await fixture.whenStable();

    expect(location.path()).toBe('/students/1/details');
  });

  it('should navigate to student form when clicking on the first edit link', async () => {
    const editLinks = fixture.nativeElement.querySelectorAll('[data-cy="studentlist-a-edit"]');

    editLinks[0].click();
    await fixture.whenStable();

    expect(location.path()).toBe('/students/1/edit');
  });

  it('should navigate to student form when clicking on create a new student link', async () => {
    const createLink = fixture.nativeElement.querySelector('[data-cy="studentslist-link-create"]');

    createLink.click();
    await fixture.whenStable();

    expect(location.path()).toBe('/students/new');
  });

  it('should open confirm dialog and delete first student when clicking on the first delete link', () => {
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
    const deleteLinks = fixture.nativeElement.querySelectorAll('[data-cy="studentlist-a-delete"]');

    deleteLinks[0].click();
    fixture.detectChanges();

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete this student?');
    expect(studentServiceMock.delete).toHaveBeenCalledWith(1);
    expect(component.students).toEqual([studentsMock[1]]);
    expect(fixture.nativeElement.textContent).not.toContain('John');
    expect(fixture.nativeElement.textContent).toContain('Jane');
    expect(component.message).toBe('Student deleted successfully');
    expect(component.messageType).toBe('success');
  });
});
