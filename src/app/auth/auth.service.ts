import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, Firestore, collection, CollectionReference, DocumentData, addDoc } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { AlertService } from '../services/alert.service';
import { SpinnerService } from '../services/spinner.service';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userCollection: CollectionReference<DocumentData>;

  authenticated: boolean = false;
  user: User = {} as User;
  auth = getAuth()

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private spinnerService: SpinnerService,
    private alertService: AlertService
  ) {
    this.userCollection = collection(this.firestore, 'users');
  }

  private async getRole(uid: string): Promise<string> {
    const usersDocRef = doc(this.firestore, `users/${uid}`)
    const usersDoc = await getDoc(usersDocRef)
    const userData = usersDoc.data()

    return userData ? userData['role'] : ''
  }

  async setUser(user: any): Promise<void> {
    const role = await this.getRole(user.uid)
    this.user = { email: user.email, uid: user.uid, role }
  }

  resetUser(): void {
    this.user = {} as User;
  }

  redirectLastRoute(): void {
    const redirectURL = this.route.snapshot.queryParamMap.get('redirectURL')
    console.log('redirect to: ', redirectURL)
    // this.router.navigate([redirectURL])
    if (redirectURL) {
      this.router.navigateByUrl(redirectURL)
        .catch(() => this.router.navigate(['']))
    } else {
      this.router.navigate([''])
    }
  }

  async login(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password)
      const { user } = userCredential
      this.authenticated = true
      this.setUser(user)
      this.redirectLastRoute()
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
      this.authenticated = false
      this.resetUser()
    }

    this.spinnerService.stopLoading()
  }

  private async createUser(user: User) {
    await addDoc(this.userCollection, user);
    return
  }

  private setUserDoc(user: User) {
    const usersDocRef = doc(this.firestore, `users/${user.uid}`)
    setDoc(usersDocRef, user)
  }

  async register(email: string, password: string): Promise<void> {
    this.spinnerService.startLoading()

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password)
      const { user } = userCredential
      this.authenticated = true
      this.setUser(user)

      this.setUserDoc({ email, role: 'USER', uid: user.uid })

      this.router.navigate([''])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
      this.authenticated = false
      this.resetUser()
    }

    this.spinnerService.stopLoading()
  }

  async logout(): Promise<void> {
    this.spinnerService.startLoading()
    try {
      signOut(this.auth)
      this.authenticated = false
      this.resetUser()
      this.router.navigate(['login'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }
}
