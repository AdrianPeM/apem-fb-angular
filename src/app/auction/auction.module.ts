import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuctionFormComponent } from '../auction-form/auction-form.component';

@NgModule({
  declarations: [
    AuctionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class AuctionModule { }
