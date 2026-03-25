import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Student } from '../../../core/models/Student';
import { LoginService } from '../../../core/service/login/login.service';
import { StudentService } from '../../../core/service/student/student.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-details',
  imports: [CommonModule, RouterLink],
  standalone: true,
  templateUrl: './student-details.component.html',
  styleUrl: './student-details.component.css'
})
export class StudentDetailsComponent implements OnInit  {

  constructor(private router: Router, private route: ActivatedRoute, public loginService: LoginService) { }

  private studentService = inject(StudentService);
  student: Student | null = null;
  errorMessage: string | null = null;
  private destroyRef = inject(DestroyRef);
  studentId: number | null = null;
    
  ngOnInit(): void {
    
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
        
    this.studentService.findById(this.studentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(student => {
        this.student = student;
      });

  }
}
