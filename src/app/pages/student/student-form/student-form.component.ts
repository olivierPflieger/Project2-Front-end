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

  constructor(private router: Router, private route: ActivatedRoute, public loginService: LoginService) { }

  students: Student[] = [];
  errorMessage: string | null = null;
  isEditMode: boolean = true;
  studentId: number | null = null;

  ngOnInit() {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));

    this.studentForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required]        
      },
    );
    
    if (this.studentId) {
      this.studentService.findById(this.studentId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(student => {
        this.studentForm.patchValue({
          firstName: student.firstName,
          lastName: student.lastName
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
        };
        this.studentService.update(student)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(
          () => {
            alert('student updated');
            // TODO : router l'utilisateur vers la page de login
          },
        );
      }
    }

    if (!this.isEditMode) {
      const student: Student = this.studentForm.value;
      this.studentService.create(student)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          alert('student created');
          // TODO : router l'utilisateur vers la page de login
        },
      );
    }
  }

  onReset(): void {
    this.submitted = false;
    this.studentForm.reset();
  }

}
