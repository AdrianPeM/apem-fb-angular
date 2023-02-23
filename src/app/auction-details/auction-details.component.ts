import { Component, OnDestroy, OnInit } from '@angular/core';
import { doc, Firestore, onSnapshot, Unsubscribe } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { getDoc } from 'firebase/firestore';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../services/alert.service';
import { Auction } from '../types/Auction';
import { User } from '../types/User';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})

export class AuctionDetailsComponent implements OnInit, OnDestroy {
  auction: Auction = {} as Auction
  private unsubscribe: any
  isActive: boolean = false

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private authService: AuthService,
    private auctionsService: AuctionsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const auctionId = this.route.snapshot.paramMap.get('id')
    if (!auctionId) return
    this.unsubscribe = onSnapshot(doc(this.firestore, 'auctions', auctionId), doc => {
      if (doc.data() === undefined) {
        this.alertService.showAlert('Esta subasta no esta disponible')
        setTimeout(() => {
          this.router.navigate([''])
        }, 1500)
        return
      }
      this.auction = { ...doc.data(), uid: doc.id } as Auction
    })
  }

  ngOnDestroy(): void {
    this.unsubscribe()
  }

  getUser(): User {
    return this.authService.user
  }

  editAuction(): void {
    this.router.navigate(['/auction'], { state: { auction: this.auction } })
  }

  bid(): void {
    this.auctionsService.bid(this.auction)
  }

}