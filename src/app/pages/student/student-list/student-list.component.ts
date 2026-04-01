import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Student } from '../../../core/models/Student';
import { LoginService } from '../../../core/service/login/login.service';
import { StudentService } from '../../../core/service/student/student.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-list',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit  {
  
  private studentService = inject(StudentService);
  students: Student[] = [];
  errorMessage: string | null = null;
  private destroyRef = inject(DestroyRef);
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  
  constructor(private router: Router, public loginService: LoginService) { }
  
  ngOnInit() {
    this.loadStudents();
  }
  
  loadStudents() {
    this.studentService.getAll()
    .subscribe({
      next: (res: HttpResponse<Student[]>) => {
        this.students = res.body || [];
      },
      error: (err) => {
        this.message = err.statusText + ': ' + err.error;
        this.messageType = 'error';
      }
    });
  }
  
  /*
  editStudent(id: number) {
    this.router.navigate(['/students-form', id, 'edit']);
  }
  */
  
  confirmDelete(id: number, event: Event) {
    
    event.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this student?');

    if (confirmed) {
      
      this.studentService.delete(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {            
            this.students = this.students.filter(s => s.id !== id);
            this.message = "Student deleted successfully";
            this.messageType = 'success';
          },
          error: (err) => {
            if (err.error && err.error.message) {
                this.message = err.statusText + ': ' + err.error.message;
              } else {
                this.message = err.statusText + ': ' + err.error;
              }
              this.messageType = 'error';            
          }
        });
    }
  }
}
