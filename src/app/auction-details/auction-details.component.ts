import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { doc, Firestore, onSnapshot, serverTimestamp, Timestamp, Unsubscribe } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuctionsService } from '../auctions/auctions.service';
import { AuthService } from '../auth/auth.service';
import { Item, ItemsService } from '../item/items.service';
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
  private unsubscribeAuction: any
  auctionForm!: FormGroup
  auction: Auction = {} as Auction
  remainingTime: number = 0
  isActive: boolean = false
  expiresOn: number = 0
  countdown!: ReturnType<typeof setInterval> | null
  items: Item[] = []
  itemsSubscription!: Subscription

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: Firestore,
    private authService: AuthService,
    private auctionsService: AuctionsService,
    private itemsService: ItemsService,
    private alertService: AlertService,
    public articleDialog: MatDialog
  ) { }

  ngOnInit(): void {
    const auctionId = this.route.snapshot.paramMap.get('id')
    if (!auctionId) return

    this.initAuctionSubscription(auctionId)
  }

  ngOnDestroy(): void {
    this.unsubscribeAuction && this.unsubscribeAuction()
  }

  initArticleForm(): void {
    this.auctionForm = this.formBuilder.group({
      startPrice: [this.auction?.startPrice || '', [Validators.required]],
      increasePrice: [this.auction?.increasePrice, [Validators.required]],
    })
  }

  initAuctionSubscription(auctionId: string): void {
    this.unsubscribeAuction = onSnapshot(doc(this.firestore, 'auctions', auctionId), doc => {
      if (doc.data() !== undefined) {
        this.auction = { ...doc.data(), uid: doc.id } as Auction
        this.initArticleForm()
        if (!this.itemsSubscription) this.initItemsSubscription()
        if (this.isActive && !this.auction.startedAt) {
          this.stopCountdown()
        } else if (this.auction.startedAt && !this.countdown && ((this.auction.startedAt.seconds + 180) > Timestamp.now().seconds)) {
          this.expiresOn = (this.auction.startedAt.seconds + 180) * 1000
          this.startCountdown()
        }
      } else {
        this.alertService.showAlert('Esta subasta no esta disponible')
        setTimeout(() => {
          this.router.navigate([''])
        }, 1500)
      }
    })
  }

  initItemsSubscription(): void {
    this.itemsSubscription = this.itemsService
      .getItems(this.auction.uid)
      .subscribe(items => {
        console.log('items changed ', items)
        this.items = items
      })
  }

  startCountdown(): void {
    this.isActive = true
    this.countdown = setInterval(() => {
      const now = Timestamp.now().seconds * 1000
      const timeLeft = this.expiresOn - now
      if (timeLeft < 0)
        this.stopCountdown()
      else
        this.remainingTime = timeLeft
    }, 1000)
  }

  stopCountdown(): void {
    this.countdown && clearInterval(this.countdown)
    this.countdown = null
    this.remainingTime = 0
    this.isActive = false
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

  startAuction(): void {
    const { startPrice, increasePrice } = this.auctionForm.value
    this.auctionsService.startAuction(this.auction.uid, startPrice, increasePrice)
  }

  stopAuction(): void {
    if (confirm('??Estas seguro que deseas detener la subasta?'))
      this.auctionsService.stopAuction(this.auction.uid)
  }

  openSelectArticle(article: Article): void {
    const articleDialogRef = this.articleDialog.open(SelectArticleDialog, {
      data: {
        article
      }
    })

    articleDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auctionsService.setAuctionArticle(this.auction.uid, article)
      }
    })
  }

  openSelectItem(item: Item): void {
    const articleDialogRef = this.articleDialog.open(SelectArticleDialog, {
      data: {
        item
      }
    })

    articleDialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('setted item ---> ', item)
        this.auctionsService.setAuctionItem(this.auction.uid, item)
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
    // Start auction with this article -> ', data
  }
}