import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, Timestamp, updateDoc } from '@angular/fire/firestore';
import { Auction } from '../types/Auction';
import { Observable } from 'rxjs'
import { SpinnerService } from '../services/spinner.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../auth/auth.service';
import { Article } from '../types/Article';
import { serverTimestamp } from 'firebase/firestore';
import { Item } from '../item/items.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private auctionCollection: CollectionReference<DocumentData>

  constructor(
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
    private spinnerService: SpinnerService,
    private alertService: AlertService
  ) {
    this.auctionCollection = collection(this.firestore, 'auctions')
  }

  getAuctions(): Observable<Auction[]> {
    const auctionsRef = collection(this.firestore, 'auctions')
    return collectionData(auctionsRef, { idField: 'uid' }) as Observable<Auction[]>
  }

  async createAuction(auction: Auction): Promise<string> {
    this.spinnerService.startLoading()
    let uid = ''
    try {
      const { title, dueDate, description, startPrice, increasePrice, articles, startsOn } = auction
      const result = await addDoc(this.auctionCollection, {
        title,
        dueDate,
        description,
        startPrice,
        increasePrice,
        articles,
        auctionItem: null,
        startsOn,
        isActive: false
      })

      uid = result.id
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
    return uid
  }

  async updateAuction(auction: Auction): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const { title, dueDate, description, startPrice, increasePrice, articles, startsOn } = auction
      const auctionsDocRef = doc(this.firestore, 'auctions', auction.uid)
      await updateDoc(auctionsDocRef, { title, dueDate, description, startPrice, increasePrice, articles, startsOn })
      this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async deleteAuction(auctionId: string): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', auctionId)
      await deleteDoc(auctionsDocRef)
      this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async bid(auction: Auction): Promise<void> {
    this.spinnerService.startLoading()
    console.log('bid for auction: ', auction.uid)
    console.log('user bidding: ', `${this.authService.user.email} - ${this.authService.user.uid}`)
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', auction.uid)
      await updateDoc(auctionsDocRef, {
        startPrice: auction.startPrice + auction.increasePrice,
        lastBid: this.authService.user.email
      })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async updateArticles(uid: string, articles: Article[]): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', uid)
      await updateDoc(auctionsDocRef, {
        articles
      })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async setAuctionArticle(uid: string, article: Article | null): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', uid)
      await updateDoc(auctionsDocRef, {
        auctionItem: article
      })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async setAuctionItem(uid: string, item: Item | null): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', uid)
      await updateDoc(auctionsDocRef, {
        auctionItem: item,
      })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async startAuction(uid: string, startPrice: number, increasePrice: number): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', uid)
      await updateDoc(auctionsDocRef, { startedAt: serverTimestamp(), startPrice, increasePrice })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async stopAuction(uid: string): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const auctionsDocRef = doc(this.firestore, 'auctions', uid)
      await updateDoc(auctionsDocRef, { startedAt: null })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

}
