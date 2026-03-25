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

  constructor(private router: Router, public loginService: LoginService) { }

  private studentService = inject(StudentService);
  students: Student[] = [];
  errorMessage: string | null = null;
  private destroyRef = inject(DestroyRef);
    
  ngOnInit() {
    this.loadStudents();
  }
  
  loadStudents() {
    this.studentService.getAll().subscribe({
      next: (res: HttpResponse<Student[]>) => {
        this.students = res.body || [];
      },
      error: (err) => {
        if (err.status != 404)
          this.errorMessage = `Error ${err.status}: ${err.statusText}`;
      }
    });
  }
  
  editStudent(id: number) {
    this.router.navigate(['/students-form', id, 'edit']);
  }
  
  confirmDelete(id: number, event: Event) {
    
    event.preventDefault();
    const confirmed = window.confirm('Are you sure you want to delete this student?');

    if (confirmed) {
      
      this.studentService.delete(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {            
            this.students = this.students.filter(s => s.id !== id);
          },
          error: (err) => {
            console.error('Delete failed', err);
            alert('Failed to delete student');
          }
        });
    }
  }
}
