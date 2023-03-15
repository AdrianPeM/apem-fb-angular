import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuctionsService } from '../auctions/auctions.service';
import { Auction } from '../types/Auction';
import { MatDialog } from '@angular/material/dialog';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { Article } from '../types/Article';
import { ItemComponent } from '../item/item.component';
import { Item, ItemsService } from '../item/items.service';
import { Timestamp } from 'firebase/firestore';
import { Subscription } from 'rxjs';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.scss']
})
export class AuctionFormComponent implements OnInit, OnDestroy {
  articles!: Article[]
  auctionForm!: FormGroup
  imagesLinks: string[] = []
  items: Item[] = []
  itemsSubscription!: Subscription

  constructor(
    private auctionsService: AuctionsService,
    private itemsService: ItemsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.initAuctionForm()
  }

  ngOnDestroy(): void {
    console.log('unsubscribe ', this.itemsSubscription)
    this.itemsSubscription.unsubscribe()
  }

  private initAuctionForm(): void {
    const auction: Auction = (history.state.auction || { articles: [] }) as Auction

    this.auctionForm = this.formBuilder.group({
      uid: [auction.uid],
      description: [auction.description, [Validators.required]],
      dueDate: [auction.dueDate, [Validators.required]],
      increasePrice: [auction.increasePrice, [Validators.required]],
      startPrice: [auction.startPrice, [Validators.required]],
      title: [auction.title, [Validators.required]],
    })

    this.articles = auction.articles || []

    if (auction.uid)
      this.initItemsSubscription()
    else
      this.saveAuctionForm()
  }

  initItemsSubscription(): void {
    console.log('initialize subscription ')
    this.itemsSubscription = this.itemsService
      .getItems(this.auctionForm.value.uid)
      .subscribe(items => {
        console.log('new items -> ', items)
        this.items = items
      })
    console.log(this.itemsSubscription)
  }

  updateAuctionArticles(): void {
    this.auctionsService.updateArticles(this.auctionForm.value.uid, this.articles)
  }

  async saveAuctionForm(): Promise<void> {
    const startsOn = Timestamp.fromDate(new Date(this.auctionForm.value.dueDate))
    const data = { ...this.auctionForm.value, articles: this.articles, startsOn }
    if (this.auctionForm.get('uid')?.value) {
      this.auctionsService.updateAuction(data)
      return
    }
    const uid = await this.auctionsService.createAuction(data)
    this.auctionForm.patchValue({ uid })
    this.initItemsSubscription()
  }

  deleteAuction(): void {
    this.auctionsService.deleteAuction(this.auctionForm.value.uid)
  }

  openArticleDialog(article: Article = {} as Article, idx: number = this.articles.length): void {
    const dialogRef = this.dialog.open(ArticleFormComponent, {
      width: '100%',
      maxWidth: '37rem',
      data: { article, idx, auctionUid: this.auctionForm.value.uid }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.articles[result.idx] = result.article
      this.updateAuctionArticles()
    })
  }

  openItemComponent(item: Item = {} as Item): void {
    const dialogRef = this.dialog.open(ItemComponent, {
      width: '100%',
      maxWidth: '37rem',
      data: { item, auctionId: this.auctionForm.value.uid }
    })

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('ItemComponent result -> ', result)
      // if (!result) return
      // this.articles[result.idx] = result.article
      // this.updateAuctionArticles()
    // })
  }
}
