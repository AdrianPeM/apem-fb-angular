import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { doc, Firestore, onSnapshot, serverTimestamp, Unsubscribe } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { getDoc, Timestamp } from 'firebase/firestore';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { AlertService } from '../services/alert.service';
import { Article } from '../types/Article';
import { Auction } from '../types/Auction';
import { User } from '../types/User';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})

export class AuctionDetailsComponent implements OnInit, OnDestroy {
  auction: Auction = {} as Auction
  private unsubscribeAuction: any

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private authService: AuthService,
    private auctionsService: AuctionsService,
    private alertService: AlertService,
    public articleDialog: MatDialog
  ) { }

  ngOnInit(): void {
    const auctionId = this.route.snapshot.paramMap.get('id')
    if (!auctionId) return

    this.unsubscribeAuction = onSnapshot(doc(this.firestore, 'auctions', auctionId), doc => {
      if (doc.data() !== undefined) {
        this.auction = { ...doc.data(), uid: doc.id } as Auction
      } else {
        this.alertService.showAlert('Esta subasta no esta disponible')
        setTimeout(() => {
          this.router.navigate([''])
        }, 1500)
      }
    })
  }

  ngOnDestroy(): void {
    this.unsubscribeAuction()
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

  showServerTimestamp(): void {
    console.log('serverTimestamp -> ', Timestamp.fromDate(new Date()))
  }

  openSelectArticle(article: Article): void {
    const articleDialogRef = this.articleDialog.open(SelectArticleDialog, {
      data: {
        article
      }
    })

    articleDialogRef.afterClosed().subscribe(result => {
      console.log('Set article ? -> ', result)
      if (result) {
        this.auctionsService.setAuctionItem(this.auction.uid, article)
      }
    })
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './select-article-dialog.html',
})
export class SelectArticleDialog {
  constructor(
    public dialogRef: MatDialogRef<SelectArticleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log('Start auction with this article -> ', data)
  }
}