import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { SpinnerService } from '../services/spinner.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated: boolean = false;

  constructor(private spinnerService: SpinnerService, private router: Router) { }

  async login(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const { user } = userCredential
      console.log(user)
      this.authenticated = true
      this.router.navigate([''])
    } catch (error: any) {
      const { code, message } = error
      console.log('code: ', code)
      console.log('message: ', message)
      this.authenticated = false
    }

    this.spinnerService.stopLoading()
  }

  async register(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const { user } = userCredential
      console.log(user)
      this.authenticated = true
      this.router.navigate([''])
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      this.authenticated = false
    }

    this.spinnerService.stopLoading()
  }

  async logout(): Promise<void> {
    const auth = getAuth();
    this.spinnerService.startLoading()
    try {
      signOut(auth)
      this.authenticated = false
      this.router.navigate(['login'])
    } catch (error) {
      console.log(error)
    }
    this.spinnerService.stopLoading()
  }
}
