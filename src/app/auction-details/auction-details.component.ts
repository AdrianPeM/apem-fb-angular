import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { doc, Firestore, onSnapshot, serverTimestamp, Timestamp, Unsubscribe } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
  private unsubscribeAuction: any
  auctionForm!: FormGroup
  auction: Auction = {} as Auction
  remainingTime: number = 0
  isActive: boolean = false
  dueDate: number = 0
  countdown!: ReturnType<typeof setInterval>

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private firestore: Firestore,
    private authService: AuthService,
    private auctionsService: AuctionsService,
    private alertService: AlertService,
    public articleDialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('ng on init')
    const auctionId = this.route.snapshot.paramMap.get('id')
    if (!auctionId) return

    this.unsubscribeAuction = onSnapshot(doc(this.firestore, 'auctions', auctionId), doc => {
      if (doc.data() !== undefined) {
        this.auction = { ...doc.data(), uid: doc.id } as Auction
        this.initArticleForm()
        if (this.isActive && !this.auction.dueDate) {
          this.stopCountdown()
        } else if (this.auction.dueDate && !this.countdown && ((this.auction.dueDate.seconds + 360) > Timestamp.now().seconds)) {
          console.log('start countdown -> ', this.auction.dueDate)
          this.dueDate = (this.auction.dueDate.seconds + 180) * 1000
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

  ngOnDestroy(): void {
    this.unsubscribeAuction()
  }

  initArticleForm(): void {
    this.auctionForm = this.formBuilder.group({
      startPrice: [this.auction?.startPrice || '', [Validators.required]],
    })
  }

  startCountdown(): void {
    this.isActive = true
    this.countdown = setInterval(() => {
      const now = Timestamp.now().seconds * 1000
      const timeLeft = this.dueDate - now
      if (timeLeft < 0)
        this.stopCountdown()
      else
        this.remainingTime = timeLeft
    }, 1000)
    console.log('countdown -> ', this.countdown)
  }

  stopCountdown(): void {
    console.log('stop countdown, interval -> ', this.countdown)
    clearInterval(this.countdown)
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

  showServerTimestamp(): void {
    console.log('serverTimestamp -> ', Timestamp.fromDate(new Date()))
  }

  startAuction(): void {
    this.auctionsService.startAuction(this.auction.uid, this.auctionForm.value.startPrice)
  }

  stopAuction(): void {
    if (confirm('¿Estas seguro que deseas detener la subasta?'))
      this.auctionsService.stopAuction(this.auction.uid)
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