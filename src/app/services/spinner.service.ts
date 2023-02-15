import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SpinnerService {

  loading: boolean = false;

  constructor() { }

  startLoading(): void {
    this.loading = true
  }

  stopLoading(): void {
    this.loading = false
  }
}
