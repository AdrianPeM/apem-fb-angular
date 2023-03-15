import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SpinnerService {
  msg: string | null = null
  loading: boolean = false
  count: number = 0

  constructor() { }

  startLoading(msg: string | null = null): void {
    this.msg = msg
    this.loading = true
  }

  stopLoading(): void {
    if (--this.count <= 0) {
      this.count = 0
      this.loading = false
      this.msg = null
    }
  }
}
