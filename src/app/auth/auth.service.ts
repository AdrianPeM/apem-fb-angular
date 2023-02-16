import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { SpinnerService } from '../services/spinner.service';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authenticated: boolean = false;
  user: User = {} as User;

  constructor(private spinnerService: SpinnerService, private router: Router) { }


  private async getRole(uid: string): Promise<string> {
    const firestore = getFirestore()
    const docRef = doc(firestore, `users/${uid}`)
    const cypheredDoc = await getDoc(docRef)
    const docData = cypheredDoc.data()

    return docData ? docData['role'] : ''
  }

  async setUser(user: any): Promise<void> {
    const role = await this.getRole(user.uid)
    this.user = { email: user.email, uid: user.uid, role }
  }

  resetUser(): void {
    this.user = {} as User;
  }

  async login(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const { user } = userCredential
      console.log(user)
      this.authenticated = true
      this.setUser(user)
      this.router.navigate([''])
    } catch (error: any) {
      const { code, message } = error
      console.log('code: ', code)
      console.log('message: ', message)
      this.authenticated = false
      this.resetUser()
    }

    this.spinnerService.stopLoading()
  }

  async register(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()

    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const { user } = userCredential
      this.authenticated = true
      this.setUser(user)

      const firestore = getFirestore()
      const docRef = await doc(firestore, `users/${user.uid}`)
      setDoc(docRef, { email, role: 'USER' })

      this.router.navigate([''])
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
      this.authenticated = false
      this.resetUser()
    }

    this.spinnerService.stopLoading()
  }

  async logout(): Promise<void> {
    const auth = getAuth();
    this.spinnerService.startLoading()
    try {
      signOut(auth)
      this.authenticated = false
      this.resetUser()
      this.router.navigate(['login'])
    } catch (error) {
      console.log(error)
    }
    this.spinnerService.stopLoading()
  }
}
