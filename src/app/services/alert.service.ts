import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  show: boolean = false
  msg: string = ''

  constructor() { }

  showAlert(msg: string, timeout: number = 3000): void {
    if (this.show) return
    this.show = true
    this.msg = msg
    setTimeout(() => {
      this.hideAlert()
    }, timeout)
  }

  hideAlert(): void {
    this.show = false
    setTimeout(() => {
      this.msg = ''
    }, 1000)
  }
}
