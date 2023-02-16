import { Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs'
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private firestore: Firestore) { }

  async setAdmin(uid: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}`)
    await updateDoc(docRef, { role: 'ADMIN' })
  }

  async revokeAdmin(uid: string): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}`)
    await updateDoc(docRef, { role: 'USER' })
  }

  getUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users')
    return collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>
  }
}
