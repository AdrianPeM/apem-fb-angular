import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { SpinnerService } from '../services/spinner.service';
import { StorageService } from '../services/storage.service';

export interface ItemImage {
  name: string,
  src: string,
}

export interface Item {
  uid: string,
  auctionId: string,
  name: string,
  images: ItemImage[]
}

@Injectable({
  providedIn: 'root'
})
export class ItemsService {
  private itemCollection: CollectionReference<DocumentData>

  constructor(
    private alertService: AlertService,
    private storageService: StorageService,
    private spinnerService: SpinnerService,
    private firestore: Firestore,
  ) {
    this.itemCollection = collection(this.firestore, 'items')
  }

  getItems(auctionId: string): Observable<Item[]> {
    const itemsRef = collection(this.firestore, 'items')
    const itemsQuery = query(itemsRef, where('auctionId', '==', auctionId))
    return collectionData(itemsQuery, { idField: 'uid' }) as Observable<Item[]>
  }

  async createItem(auctionId: string, item: Item): Promise<string> {
    this.spinnerService.startLoading()
    let uid = ''
    try {
      const { name, images = [] } = item
      const result = await addDoc(this.itemCollection, {
        auctionId, name, images
      })

      uid = result.id
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
    return uid
  }

  async deleteItem(item: Item): Promise<void> {
    this.spinnerService.startLoading()
    try {
      for (const img of item.images) {
        await this.storageService.deleteFile(`${item.auctionId}/${item.uid}/${img.name}`)
      }
      const auctionsDocRef = doc(this.firestore, 'items', item.uid)
      await deleteDoc(auctionsDocRef)
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async updateItem(item: Item): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const { name } = item
      const itemsDocRef = doc(this.firestore, 'items', item.uid)
      await updateDoc(itemsDocRef, { name })
      // this.router.navigate(['/'])
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async updateItemImages(images: ItemImage[], uid: string): Promise<void> {
    this.spinnerService.startLoading()
    try {
      const itemsDocRef = doc(this.firestore, 'items', uid)
      await updateDoc(itemsDocRef, { images })
    } catch (error: any) {
      this.alertService.showAlert(`${error.code} - ${error.message}`)
    }
    this.spinnerService.stopLoading()
  }

  async uploadFiles(files: FileList | File[], auctionId: string, itemId: string): Promise<ItemImage[]> {
    this.spinnerService.startLoading()
    const filesArray: File[] = Array.from(files)

    const promises = filesArray.map(file => {
      return this.storageService.uploadFile(file, undefined, `${auctionId}/${itemId}/`)
    })

    const links = await Promise.all(promises)
    const itemImages = links.map((link, i) => {
      const match = link.match(/%[!*\ \_\-a-zA-Z0-9]+.([a-zA-Z])+/g)
      const linkName: string = match ? match[match.length - 1].slice(3) : 'name-not-found' + i
      // this.images.push({ src: link, name: linkName })
      return ({ src: link, name: linkName })
    })
    this.spinnerService.stopLoading()
    return itemImages
  }

}
