import { TestBed } from '@angular/core/testing';
import { StudentService } from './student.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Student } from '../../models/Student';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/students';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StudentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all students', () => {
    const mockStudents: Student[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', birthDate: '2000-01-01' }
    ];

    service.getAll().subscribe(res => {
      expect(res.body).toEqual(mockStudents);
      expect(res.status).toBe(200);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');

    req.flush(mockStudents, { status: 200, statusText: 'OK' });
  });

  it('should get a student by id', () => {
    const student: Student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@test.com',
      birthDate: '2000-01-01'
    };

    service.findById(1).subscribe(res => {
      expect(res).toEqual(student);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');

    req.flush(student);
  });

  it('should create a student', () => {
    const student: Student = {
      id: 1,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@test.com',
      birthDate: '2001-01-01'
    };

    service.create(student).subscribe(res => {
      expect(res.body).toEqual(student);
      expect(res.status).toBe(201);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');

    req.flush(student, { status: 201, statusText: 'Created' });
  });

  it('should update a student', () => {
    const student: Student = {
      id: 1,
      firstName: 'Updated',
      lastName: 'Doe',
      email: 'updated@test.com',
      birthDate: '2000-01-01'
    };

    service.update(student).subscribe(res => {
      expect(res.body).toEqual(student);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');

    req.flush(student, { status: 200, statusText: 'OK' });
  });

  it('should delete a student', () => {
    service.delete(1).subscribe(res => {
      expect(res.status).toBe(200);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null, { status: 200, statusText: 'OK' });
  });
});