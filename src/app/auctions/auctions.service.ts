import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Auction } from '../types/Auction';
import { Observable } from 'rxjs'
import { SpinnerService } from '../services/spinner.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionsService {
  private auctionCollection: CollectionReference<DocumentData>

  constructor(private router: Router, private firestore: Firestore, private spinnerService: SpinnerService, private alertService: AlertService) {
    this.auctionCollection = collection(this.firestore, 'auctions')
  }

  getAuctions(): Observable<Auction[]> {
    const usersRef = collection(this.firestore, 'auctions')
    return collectionData(usersRef, { idField: 'uid' }) as Observable<Auction[]>
  }

  async createAuction(auction: Auction): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const { title, description, startPrice, increasePrice } = auction
      await addDoc(this.auctionCollection, { title, description, startPrice, increasePrice })
      this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async updateAuction(auction: Auction): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const { title, description, startPrice, increasePrice } = auction
      const auctionDocRef = doc(this.firestore, `auctions/${auction.uid}`)
      await updateDoc(auctionDocRef, { title, description, startPrice, increasePrice })
      this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

}
