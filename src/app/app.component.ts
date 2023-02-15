import { Component, OnInit } from '@angular/core';
import { initializeApp } from "firebase/app";
import { AuthService } from './auth/auth.service';
import { firebaseConfig } from './firebase.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'apem-fb-angular';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    initializeApp(firebaseConfig);
  }

  isAuthenticated = (): boolean => {
    return this.authService.authenticated
  }

  logout(): void {
    this.authService.logout()
  }
}
