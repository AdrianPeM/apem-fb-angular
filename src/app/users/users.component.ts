import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../types/User';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<User> = [];

  constructor(private authService: AuthService, private userService: UsersService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users
    })
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
