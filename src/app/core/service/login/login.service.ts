import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../../models/Login';
import { TokenResponse } from '../../models/TokenResponse';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private httpClient: HttpClient) { }
  
  private readonly ID_TOKEN = 'id_token';

  login(loginUser: Login): Observable<HttpResponse<TokenResponse>> {
    return this.httpClient.post<TokenResponse>('/api/login', loginUser, { observe: 'response' })     
  }

  public setToken(token: string): void {
    localStorage.setItem(this.ID_TOKEN, token);
  }
}