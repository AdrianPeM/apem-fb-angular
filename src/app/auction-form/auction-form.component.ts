import { Component, OnInit } from '@angular/core';
import { AuctionsService } from '../auctions/auctions.service';
import { Auction } from '../types/Auction';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.scss']
})
export class AuctionFormComponent implements OnInit {
  auction: Auction = {} as Auction;

  constructor(private auctionsService: AuctionsService) { }

  ngOnInit(): void {
    if (history.state.auction) this.auction = history.state.auction
  }

  saveAuction(auction: Auction): void {
    if (auction.uid) {
      this.auctionsService.updateAuction(auction)
      return
    }
    this.auctionsService.createAuction(auction)
  }

  deleteAuction(): void {
    this.auctionsService.deleteAuction(this.auction.uid)
  }

}
