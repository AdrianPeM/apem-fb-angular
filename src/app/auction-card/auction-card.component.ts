import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { Auction } from '../types/Auction';

const MS_DAYS = 8.64e7, MS_HOURS = 3.6e6, MS_MINUTES = 6e4, MS_SECONDS = 1e3

const divmod = (n: number, m: number) => [Math.trunc(n / m), n % m]

const dhms = (durationMs: number): string => {
  const [days, daysMs] = divmod(durationMs, MS_DAYS)
  const [hours, hoursMs] = divmod(daysMs, MS_HOURS)
  const [minutes, minutesMs] = divmod(hoursMs, MS_MINUTES)
  const seconds = minutesMs / MS_SECONDS
  return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.floor(seconds)).padStart(2, '0')}`
}


@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.component.html',
  styleUrls: ['./auction-card.component.scss']
})
export class AuctionCardComponent implements OnInit {
  @Input() auction: Auction = {} as Auction

  remainingTime: string = ''
  isActive: boolean = false
  now: any = ''

  constructor(private router: Router, private authService: AuthService, private auctionsService: AuctionsService) { }

  ngOnInit(): void {
    if (history.state.auction) this.auction = history.state.auction

    if (new Date(this.auction.dueDate).getTime() <= Date.now()) return
    this.startCountDown()
  }

  startCountDown(): void {
    this.isActive = true
    const countDown = setInterval(() => {
      const timeLeft = new Date(this.auction.dueDate).getTime() - Date.now()
      this.now = timeLeft
      if (timeLeft < 0) {
        clearInterval(countDown);
        this.remainingTime = ''
        this.isActive = true
      } else {
        this.remainingTime = dhms(timeLeft)
      }
    }, 1000)
  }

  getUserRole(): string | null {
    return this.authService.user.role
  }

  saveAuction(auction: Auction): void {
    if (auction.uid) {
      this.auctionsService.updateAuction(auction)
      return
    }
    this.auctionsService.createAuction(auction)
  }

  editAuction(auction: Auction): void {
    this.router.navigate(['/auction'], { state: { auction } })
  }

  openDetails(auction: Auction): void {
    console.log('Open auction details for : ', auction)
  }

  bid(auction: Auction): void {
    this.auctionsService.bid(auction)
  }

}
