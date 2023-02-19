import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../services/alert.service';
import { Auction } from '../types/Auction';
import { AuctionsService } from './auctions.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})
export class AuctionsComponent implements OnInit {

  auctions: Array<Auction> = []

  constructor(private router: Router, private auctionsService: AuctionsService, private authService: AuthService, private alertService: AlertService) { }

  ngOnInit(): void {
    this.auctionsService.getAuctions().subscribe(auctions => {
      this.auctions = auctions
    })
  }

  getUserRole(): string | null {
    return this.authService.user.role
  }

  newAuction(): void {
    this.router.navigate(['/auction'])
  }

  editAuction(auction: Auction): void {
    this.router.navigate(['/auction'], { state: { auction } })
  }

  showAlert(): void {
    this.alertService.showAlert('Error testing')
  }
}
