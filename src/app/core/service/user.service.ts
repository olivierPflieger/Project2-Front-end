import { Injectable } from '@angular/core';
import { Register } from '../models/Register';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private httpClient: HttpClient) { }

  //register(user: Register): Observable<Object> {
  //  return this.httpClient.post('/api/register', user);
  //}

  register(user: Register): Observable<HttpResponse<Register>> {
      return this.httpClient.post<Register>('api/register', user, { observe: 'response' });
  }
}
