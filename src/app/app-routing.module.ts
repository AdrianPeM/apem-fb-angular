import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { AuctionFormComponent } from './auction-form/auction-form.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthGuard } from './auth/guards/auth.guard';
import { AuthenticatedGuard } from './auth/guards/authenticated.guard';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BooksComponent } from './books/books.component';
import { CartComponent } from './cart/cart.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  { path: '', component: AuctionsComponent },
  { path: 'users', component: UsersComponent, canActivate: [AdminGuard] },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthenticatedGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthenticatedGuard] },
  { path: 'books', component: BooksComponent },
  { path: 'auction', component: AuctionFormComponent, canActivate: [AdminGuard] },
  { path: 'auction_details/:id', component: AuctionDetailsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
