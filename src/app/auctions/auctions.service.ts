import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Auction } from '../types/Auction';
import { Observable } from 'rxjs'
import { SpinnerService } from '../services/spinner.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { AuthService } from '../auth/auth.service';
import { Article } from '../types/Article';

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
      const { title, dueDate, description, startPrice, increasePrice, articles } = auction
      const result = await addDoc(this.auctionCollection, { title, dueDate, description, startPrice, increasePrice, articles })
      uid = result.id
      // this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
    return uid
  }

  async updateAuction(auction: Auction): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const { title, dueDate, description, startPrice, increasePrice, articles } = auction
      const auctionsDocRef = doc(this.firestore, 'auctions', auction.uid)
      await updateDoc(auctionsDocRef, { title, dueDate, description, startPrice, increasePrice, articles })
      this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async deleteAuction(auctionId: string): Promise<void> {
    this.spinnerService.startLoading()
    if (!confirm("¿Estas seguro de eliminar esta subasta?")) return
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
    this.spinnerService.startLoading('Guardando artículo')
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

}
