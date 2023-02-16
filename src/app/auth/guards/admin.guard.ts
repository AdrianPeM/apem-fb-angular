import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) { }

  canActivate() {
    if (!this.authService.authenticated)
      this.router.navigate(['login'])
    else if (this.authService.user.role !== 'ADMIN')
      this.router.navigate([''])

    return this.authService.authenticated && (this.authService.user.role === 'ADMIN');
  }
}
