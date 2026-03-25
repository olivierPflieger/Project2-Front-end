import { Routes } from '@angular/router';
import {RegisterComponent} from './pages/register/register.component';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import { AuthGuard } from './core/Guards/auth.guard';
import { StudentListComponent } from './pages/student/student-list/student-list.component';
import { StudentFormComponent } from './pages/student/student-form/student-form.component';
import { StudentDetailsComponent } from './pages/student/student-details/student-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent, 
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'students',
    component: StudentListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/:id/edit',
    component: StudentFormComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/:id/details',
    component: StudentDetailsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'students/new',
    component: StudentFormComponent,
    canActivate: [AuthGuard]
  }
];
