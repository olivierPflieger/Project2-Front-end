import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './core/service/login/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    RouterOutlet
  ],
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'etudiant-frontend';
  private loginService = inject(LoginService);

  ngOnInit() {
    if (this.loginService.isTokenExpired()) {
      this.loginService.logout();
    }
  }
}
