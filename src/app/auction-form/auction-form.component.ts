import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuctionsService } from '../auctions/auctions.service';
import { Auction } from '../types/Auction';
import { MatDialog } from '@angular/material/dialog';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { Article } from '../types/Article';

@Component({
  selector: 'app-auction-form',
  templateUrl: './auction-form.component.html',
  styleUrls: ['./auction-form.component.scss']
})
export class AuctionFormComponent implements OnInit {
  articles!: Article[]
  auctionForm!: FormGroup
  imagesLinks: string[] = []

  constructor(
    private auctionsService: AuctionsService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initAuctionForm()
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

    if (!auction.uid)
      this.saveAuctionForm()
  }

  updateAuctionArticles(): void {
    this.auctionsService.updateArticles(this.auctionForm.value.uid, this.articles)
  }

  async saveAuctionForm(): Promise<void> {
    const data = { ...this.auctionForm.value, articles: this.articles }
    if (this.auctionForm.get('uid')?.value) {
      this.auctionsService.updateAuction(data)
      return
    }
    const uid = await this.auctionsService.createAuction(data)
    this.auctionForm.patchValue({ uid })
  }

  deleteAuction(): void {
    this.auctionsService.deleteAuction(this.auctionForm.value.uid)
  }

  openArticleDialog(article: Article = {} as Article, idx: number = this.articles.length): void {
    const dialogRef = this.dialog.open(ArticleFormComponent, {
      width: '70vw',
      data: { article, idx, auctionUid: this.auctionForm.value.uid }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return
      this.articles[result.idx] = result.article
      this.updateAuctionArticles()
    })
  }
}
