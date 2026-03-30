import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { Student } from '../../../core/models/Student';
import { LoginService } from '../../../core/service/login/login.service';
import { StudentService } from '../../../core/service/student/student.service';
import { HttpResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/material.module';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-student-form',
  imports: [CommonModule, MaterialModule, RouterLink],
  standalone: true,
  templateUrl: './student-form.component.html',
  styleUrl: './student-form.component.css'
})

export class StudentFormComponent implements OnInit  {
  
  private formBuilder = inject(FormBuilder);
  private studentService = inject(StudentService);
  studentForm: FormGroup = new FormGroup({});
  private destroyRef = inject(DestroyRef);
  submitted: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;
  students: Student[] = [];  
  isEditMode: boolean = true;
  studentId: number | null = null;

  constructor(private router: Router, private route: ActivatedRoute, public loginService: LoginService) { }

  ngOnInit() {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));

    this.studentForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        birthDate: ['', Validators.required]
      },
    );
    
    if (this.studentId) {
      this.studentService.findById(this.studentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(student => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName,
          email:student.email,
          birthDate:student.birthDate
        });
      });
    } else {
      this.isEditMode = false;
    }    
  }

  get form() {
    return this.studentForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.studentForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      if (this.studentId !== null) {
        const student: Student = {
          id: this.studentId,
          firstName: this.studentForm.get('firstName')?.value,
          lastName: this.studentForm.get('lastName')?.value,
          email: this.studentForm.get('email')?.value,
          birthDate: this.studentForm.get('birthDate')?.value,
        };
        
        this.studentService.update(student)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.message = "Student updated successfully";
            this.messageType = 'success';
          },
          error: (err) => {
            if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = err.error;
              }
              this.messageType = 'error';
          }
        });
      }
    }

    if (!this.isEditMode) {
      const student: Student = this.studentForm.value;
      this.studentService.create(student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
          next: () => {
            this.message = "Student created successfully";
            this.messageType = 'success';
          },
          error: (err) => {
            if (err.error && err.error.message) {
                this.message = err.error.message;
              } else {
                this.message = err.error;
              }
              this.messageType = 'error';
          }
        });
    }
  }

  onReset(): void {
    this.submitted = false;
    this.studentForm.reset();
  }

}
