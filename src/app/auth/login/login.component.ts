import { Component, OnInit } from '@angular/core';
import { LoginForm } from 'src/app/types/Auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: LoginForm = {
    email: '',
    password: ''
  }

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  submit(): void {
    this.authService.login(this.form.email, this.form.password)
  }
}
