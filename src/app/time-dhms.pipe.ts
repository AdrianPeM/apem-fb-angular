import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeDHMS'
})
export class TimeDHMSPipe implements PipeTransform {
  private MS_DAYS: number = 8.64e7
  private MS_HOURS: number = 3.6e6
  private MS_MINUTES: number = 6e4
  private MS_SECONDS: number = 1e3

  transform(value: number, ...args: unknown[]): unknown {
    return this.dhms(value)
  }

  divmod = (n: number, m: number) => [Math.trunc(n / m), n % m]

  dhms = (durationMs: number): string => {
    const [days, daysMs] = this.divmod(durationMs, this.MS_DAYS)
    const [hours, hoursMs] = this.divmod(daysMs, this.MS_HOURS)
    const [minutes, minutesMs] = this.divmod(hoursMs, this.MS_MINUTES)
    const seconds = minutesMs / this.MS_SECONDS
    return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`
  }

}
