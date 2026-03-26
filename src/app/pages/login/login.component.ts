import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { Login } from '../../core/models/Login';
import { LoginService } from '../../core/service/login/login.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [CommonModule, MaterialModule, RouterLink],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {  
  private loginService = inject(LoginService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  message: string | null = null;
  messageType: 'success' | 'error' | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group(
      {        
        login: ['', Validators.required],
        password: ['', Validators.required]
      },
    );    
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const loginUser: Login = {
      login: this.loginForm.get('login')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.loginService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          const token = res.body?.token.toString();
          if (token) {
            this.loginService.setToken(token);
            this.loginService.setUserName(loginUser.login);
            this.router.navigate(['']);
          } else {
            alert ('The returned token is empty !');            
          }                    
        },
        error: (err) => {
            this.message = err.statusText + ': ' + err.error;
            this.messageType = 'error';
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}
