import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthService } from './auth/auth.service';
import { LoadingAppService } from './services/loading-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'apem-fb-angular';

  constructor(private router: Router, private authService: AuthService, private loadingAppService: LoadingAppService) { }

  ngOnInit(): void {
    this.loadingAppService.startLoading()
    const auth = getAuth()
    onAuthStateChanged(auth, user => {
      if (user) {
        this.authService.authenticated = true
        this.authService.setUser(user).then(() => {
          console.log('App component set user', this.authService.user)
        })
        this.router.navigate(['/'])
      }
      setTimeout(() => {
        this.loadingAppService.stopLoading()
      }, 600);
    })
  }

  isAuthenticated = (): boolean => {
    return this.authService.authenticated
  }

  getUserRole = (): string | null => {
    return this.authService.user.role
  }

  logout(): void {
    this.authService.logout()
  }
}
