import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BooksComponent } from './books/books.component';
import { CartComponent } from './cart/cart.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: BooksComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthenticatedGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
