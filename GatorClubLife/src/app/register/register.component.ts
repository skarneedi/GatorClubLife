import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [],
})
export class RegisterComponent {
  constructor(private auth: AuthService) { }

  register() {
    this.auth.login(); // Auth0 provides sign-up option
  }
}
