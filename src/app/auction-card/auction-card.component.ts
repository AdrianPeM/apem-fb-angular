import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { doc, Firestore, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { Auction } from '../types/Auction';

@Component({
  selector: 'app-auction-card',
  templateUrl: './auction-card.component.html',
  styleUrls: ['./auction-card.component.scss']
})

export class AuctionCardComponent implements OnInit, OnDestroy {
  @Input() auction: Auction = {} as Auction

  private unsubscribe: any

  remainingTime: number = 0
  isActive: boolean = false

  constructor(private firestore: Firestore, private router: Router, private authService: AuthService, private auctionsService: AuctionsService) { }

  ngOnInit(): void {
    this.unsubscribe = onSnapshot(doc(this.firestore, 'auctions', this.auction.uid), doc => {
      const newAuction = { ...doc.data(), uid: doc.id } as Auction
      this.auction = newAuction
      if (new Date(this.auction.dueDate).getTime() <= Date.now()) return
      this.startCountDown()
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  startCountDown(): void {
    this.isActive = true
    const countDown = setInterval(() => {
      const timeLeft = new Date(this.auction.dueDate).getTime() - Date.now()
      if (timeLeft < 0) {
        clearInterval(countDown);
        this.remainingTime = 0
        this.isActive = false
      } else {
        this.remainingTime = timeLeft
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

  editAuction(): void {
    this.router.navigate(['/auction'], { state: { auction: this.auction } })
  }

  openDetails(): void {
    console.log('Open auction details for : ', this.auction)
    this.router.navigate([`auction_details/${this.auction.uid}`])
  }

  bid(): void {
    if (!this.authService.user.email) {
      this.router.navigate(['login'])
      return
    }
    this.auctionsService.bid(this.auction)
  }

}
