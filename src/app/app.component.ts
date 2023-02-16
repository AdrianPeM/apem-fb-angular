import { Component, OnInit } from '@angular/core';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'apem-fb-angular';

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      if (user) {
        this.authService.authenticated = true
        this.authService.setUser(user).then(() => {
          console.log('App component set user', this.authService.user)
        })
      }
    })
  }

  isAuthenticated = (): boolean => {
    return this.authService.authenticated
  }

  logout(): void {
    this.authService.logout()
  }
}
