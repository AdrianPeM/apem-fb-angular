import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { Auction } from '../types/Auction';

@Component({
  selector: 'app-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})

export class AuctionComponent implements OnInit {
  @Input() auction: Auction = {} as Auction;

  constructor(private router: Router, private authService: AuthService, private auctionsService: AuctionsService) { }

  ngOnInit(): void {
    if (history.state.auction) this.auction = history.state.auction
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
    console.log('bid for auction: ', auction.uid)
    console.log('user bidding: ', `${this.authService.user.email} - ${this.authService.user.uid}`)
  }

}
