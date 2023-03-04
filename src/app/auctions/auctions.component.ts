import { Component, OnInit, OnDestroy } from '@angular/core';
import { collection, Firestore, getDocs } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../services/alert.service';
import { Auction } from '../types/Auction';
import { AuctionsService } from './auctions.service';

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.scss']
})

export class AuctionsComponent implements OnInit, OnDestroy {
  suscription: Subscription = new Subscription()

  auctions: Array<Auction> = []

  constructor(
    private firestore: Firestore,
    private router: Router,
    private auctionsService: AuctionsService,
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.suscription = this.auctionsService
      .getAuctions()
      .subscribe(auctions => { /*if (auctions.length !== this.auctions.length) */this.auctions = auctions })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe()
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
