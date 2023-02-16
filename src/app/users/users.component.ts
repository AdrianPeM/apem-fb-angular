import { Component, OnInit } from '@angular/core';
import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  async setAdmin(): Promise<void> {
    const firestore = getFirestore()
    const docRef = doc(firestore, `users/${this.authService.user.uid}`)
    const response = await setDoc(docRef, { email: this.authService.user.email, role: 'ADMIN' })
    console.log(response)
  }

}
