import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from "../../models/Student";
import {LoginService } from "../../service/login/login.service";

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly apiUrl = "/api/students";

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<HttpResponse<Student[]>> {
     return this.httpClient.get<Student[]>(this.apiUrl, { observe: 'response' });
  }

  findById(id : number): Observable<Student> {
     return this.httpClient.get<Student>(this.apiUrl + "/" + id);
  }

  create(student: Student): Observable<HttpResponse<Student>> {
      return this.httpClient.post<Student>(this.apiUrl, student, { observe: 'response' });
  }

  update(student: Student): Observable<HttpResponse<Student>> {
      return this.httpClient.put<Student>(this.apiUrl + "/" + student.id, student, { observe: 'response' });
  }
    
  delete(id: number): Observable<HttpResponse<void>> {
      return this.httpClient.delete<void>(this.apiUrl + "/" + id, { observe: 'response' });
  }      
}
