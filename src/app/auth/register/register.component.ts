import { Component, OnInit } from '@angular/core';
import { RegisterForm } from 'src/app/types/Auth';
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: RegisterForm = {
    email: '',
    password: '',
    password_confirm: ''
  }

  passwordsMatch: boolean = true;

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
  }

  submit(): void {
    this.passwordsMatch = this.form.password === this.form.password_confirm
    if (!this.passwordsMatch) return

    this.authService.register(this.form.email, this.form.password)
  }
}
