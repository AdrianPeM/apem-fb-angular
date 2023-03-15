import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuctionFormComponent } from '../auction-form/auction-form.component';
import { AppRoutingModule } from '../app-routing.module';
import { NgMaterialModule } from '../ng-material/ng-material.module';

@NgModule({
  declarations: [
    AuctionFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgMaterialModule
  ]
})
export class AuctionModule { }
