import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from '../services/storage.service';
import { Item, ItemImage, ItemsService } from './items.service';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  public files: NgxFileDropEntry[] = [];
  auctionId: string
  item: Item
  images: ItemImage[]
  initialImages: ItemImage[]
  allowedFiles = ['.jpg', '.jpeg', '.gif', '.apng', '.svg', '.bmp', '.png']

  itemForm!: FormGroup

  constructor(
    private itemsService: ItemsService,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    public dialogRef: MatDialogRef<ItemComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    const { auctionId, item } = data
    const { images = [] } = item
    this.auctionId = auctionId
    this.item = item
    this.images = [...images]
    this.initialImages = [...images]
  }

  ngOnInit(): void {
    this.initAuctionForm()
  }

  private initAuctionForm(): void {

    const item: Item = (this.item || { images: [] }) as Item

    this.itemForm = this.formBuilder.group({
      name: [item.name, [Validators.required]]
    })

    if (!this.item.uid)
      setTimeout(() => {
        this.saveItemForm()
      }, 0)
  }

  async saveItemForm(closeDialog: boolean = true): Promise<void> {
    const data = { ...this.itemForm.value, uid: this.item.uid }
    if (this.item.uid) {
      await this.itemsService.updateItem(data)
      if (closeDialog)
        this.dialogRef.close()
    } else {
      const uid = await this.itemsService.createItem(this.auctionId, data)
      this.item.uid = uid
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.storageService.deleteFile(`${this.auctionId}/${this.item.uid}/${fileName}`)
    this.images = this.images.filter(({ name }) => name !== fileName)
    this.itemsService.updateItemImages(this.images, this.item.uid)
  }

  isFileAllowed(fileName: string) {
    let isFileAllowed = false;
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      for (const ext of this.allowedFiles) {
        if (ext === extension[0]) {
          isFileAllowed = true;
        }
      }
    }
    return isFileAllowed;
  }

  getFile(fileEntry: FileSystemFileEntry): Promise<File> {
    return new Promise((resolve) => {
      fileEntry.file(resolve)
    })
  }

  async dropped(files: NgxFileDropEntry[]) {
    const filteredFiles: File[] = []
    const allowedFiles = files.filter(droppedFile => droppedFile.fileEntry.isFile && this.isFileAllowed(droppedFile.fileEntry.name))

    for (const droppedFile of allowedFiles) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      const retreivedFile = await this.getFile(fileEntry)
      filteredFiles.push(retreivedFile)
    }

    console.log('upload files ---->', filteredFiles)

    if (filteredFiles.length > 0) {
      const itemImages = await this.itemsService.uploadFiles(filteredFiles, this.auctionId, this.item.uid)
      this.images.push(...itemImages)
      this.itemsService.updateItemImages(this.images, this.item.uid)
    }
  }

}
