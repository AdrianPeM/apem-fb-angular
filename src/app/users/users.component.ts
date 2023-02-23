import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../types/User';
import { UsersService } from './users.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {
  private usersSubscribe: Subscription = new Subscription()
  users: Array<User> = [];

  constructor(private authService: AuthService, private userService: UsersService) { }

  ngOnInit(): void {
    this.usersSubscribe = this.userService.getUsers().subscribe(users => {
      this.users = users
    })
  }

  ngOnDestroy(): void {
    this.usersSubscribe.unsubscribe()
  }

  getUser() {
    return this.authService.user
  }

  setAdmin(uid: any): void {
    this.userService.setAdmin(uid)
  }

  revokeAdmin(uid: any): void {
    this.userService.revokeAdmin(uid)
  }

}
