import { TestBed } from '@angular/core/testing';
import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Login } from '../../models/Login';
import { TokenResponse } from '../../models/TokenResponse';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  const apiUrl = '/api/login';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoginService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('should call login API', () => {
    const loginData: Login = { login: 'jdoe', password: 'pass' };
    const response: TokenResponse = { token: 'fake-jwt-token' };

    service.login(loginData).subscribe(res => {
      expect(res.body).toEqual(response);
      expect(res.status).toBe(200);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(loginData);

    req.flush(response, { status: 200, statusText: 'OK' });
  });
  
  it('should set and get token', () => {
    service.setToken('my-token');
    expect(service.getToken()).toBe('my-token');
  });
  
  it('should set and get username', () => {
    service.setUserName('jdoe');
    expect(service.getUserName()).toBe('jdoe');
  });
  
  it('should return false if no token', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should return true if token exists', () => {
    service.setToken('token');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should remove token and username on logout', () => {
    service.setToken('token');
    service.setUserName('jdoe');

    service.logout();

    expect(service.getToken()).toBeNull();
    expect(service.getUserName()).toBeNull();
  });

  it('should return true if token is expired', () => {
    const expiredPayload = {
      exp: Math.floor(Date.now() / 1000) - 1000
    };

    const token = generateFakeToken(expiredPayload);
    service.setToken(token);

    expect(service.isTokenExpired()).toBe(true);
  });

  it('should return false if token is valid', () => {
    const validPayload = {
      exp: Math.floor(Date.now() / 1000) + 1000
    };

    const token = generateFakeToken(validPayload);
    service.setToken(token);

    expect(service.isTokenExpired()).toBe(false);
  });

  it('should return true if no token', () => {
    expect(service.isTokenExpired()).toBe(true);
  });
});


function generateFakeToken(payload: any): string {
  const base64Payload = btoa(JSON.stringify(payload));
  return `header.${base64Payload}.signature`;
}