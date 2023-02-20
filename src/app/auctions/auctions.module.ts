import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionFormComponent } from '../auction-form/auction-form.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    AuctionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule
  ]
})
export class AuctionModule { }
