import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SpinnerService {
  msg: string | null = null
  loading: boolean = false

  constructor() { }

  startLoading(msg: string | null = null): void {
    this.msg = msg
    this.loading = true
  }

  stopLoading(): void {
    this.msg = null
    this.loading = false
  }
}
