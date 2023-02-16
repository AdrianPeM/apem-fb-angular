import { Injectable } from '@angular/core';
import { CanActivate, Router, } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    if (this.authService.authenticated)
      this.router.navigate([''])
    return !this.authService.authenticated;
  }

}
