import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Register } from '../models/Register';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  const apiUrl = 'api/register';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should call register API and return user', () => {
    
    const user: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'jdoe',
      password: 'pass'
    };

    service.register(user).subscribe(res => {
      expect(res.body).toEqual(user);
      expect(res.status).toBe(201);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);

    req.flush(user, { status: 201, statusText: 'Created' });
  });
  
  it('should handle error when register fails', () => {
    const user: Register = {
      firstName: 'John',
      lastName: 'Doe',
      login: 'jdoe',
      password: 'pass'
    };

    const errorMessage = { message: 'User already exists' };

    service.register(user).subscribe({
      next: () => fail('should have failed'),
      error: err => {
        expect(err.status).toBe(400);
        expect(err.error).toEqual(errorMessage);
      }
    });

    const req = httpMock.expectOne(apiUrl);
    req.flush(errorMessage, { status: 400, statusText: 'Bad Request' });
  });
});