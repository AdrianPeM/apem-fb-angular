import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CartComponent } from './cart/cart.component';
import { BooksModule } from './books/books.module';
import { AuthModule } from './auth/auth.module';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { UsersComponent } from './users/users.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { LoadingAppComponent } from './components/loading-app/loading-app.component';
import { AuctionCardComponent } from './auction-card/auction-card.component';
import { AuctionsComponent } from './auctions/auctions.component';
import { AlertComponent } from './components/alert/alert.component';
import { AuctionModule } from './auctions/auctions.module';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { TimeDHMSPipe } from './time-dhms.pipe';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ArticleFormComponent } from './article-form/article-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgMaterialModule } from './ng-material/ng-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    CartComponent,
    SpinnerComponent,
    UsersComponent,
    LoadingAppComponent,
    AuctionCardComponent,
    AuctionsComponent,
    AlertComponent,
    AuctionDetailsComponent,
    TimeDHMSPipe,
    ArticleFormComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    BooksModule,
    AuthModule,
    AuctionModule,
    ReactiveFormsModule,
    NgMaterialModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
