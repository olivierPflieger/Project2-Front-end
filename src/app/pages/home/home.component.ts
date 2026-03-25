import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { Router, RouterLink } from "@angular/router";
import { LoginService } from '../../core/service/login/login.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, MaterialModule, RouterLink],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private router: Router, public loginService: LoginService) {}

  logout() {
    this.loginService.logout();
  }
}
