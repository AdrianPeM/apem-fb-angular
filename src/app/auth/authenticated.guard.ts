import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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