import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule } from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog'
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule
  ], exports: [
    MatSliderModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule
  ]
})
export class NgMaterialModule { }
