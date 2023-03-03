import { Component, OnInit, Input, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { UploadTaskSnapshot } from 'firebase/storage';
import { SpinnerService } from '../services/spinner.service';
import { StorageService } from '../services/storage.service';
import { Article } from '../types/Article';

// interface ArticleImage {
//   // [key: string]: {
//   src: string,
//   name: string
//   // }
// }

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  @Input() article = {} as Article
  articleForm!: FormGroup
  initialImages!: any[]
  images!: any[]
  idx: number | null = null
  auctionUid: string

  constructor(
    private storageService: StorageService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ArticleFormComponent>,
    private spinnerService: SpinnerService,
    @Inject(MAT_DIALOG_DATA) data: any) {
    const { article } = data
    const { images = [] } = article
    this.article = article
    this.images = [...images]
    this.initialImages = [...images]
    this.idx = data.idx
    this.auctionUid = data.auctionUid
  }

  ngOnInit(): void {
    this.initArticleForm()
  }

  initArticleForm(): void {
    this.articleForm = this.formBuilder.group({
      name: [this.article.name, [Validators.required]],
      images: [this.article.images]
    })
  }

  async cancel(): Promise<void> {
    await this.deleteArticleFiles()
    console.log('images cleared')
    this.dialogRef.close()
  }

  saveArticle(): void {
    this.dialogRef.close({ article: { ...this.articleForm.value, images: this.images }, idx: this.idx })
  }

  async uploadFiles(event: any): Promise<void> {
    this.spinnerService.startLoading()
    if (!event.target.files || !event.target.files.length) return
    const files: File[] = Array.from(event.target.files)
    // const imageObjects: any = {}

    // for (const file of files) {
    //   const preview = (await this.storageService.getPreview(file)) as string
    //   imageObjects[file.name] = { preview }
    // }

    // this.previews = objects

    const promises = files.map(file => {
      return this.storageService.uploadFile(file, undefined, `${this.auctionUid}/${this.idx}/`)
      //, (snapshot) => this.onUpdateUpload(snapshot, file.name))
    })

    const links = await Promise.all(promises)
    links.forEach((link, i) => {
      const match = link.match(/%[!*\ \_\-a-zA-Z0-9]+.([a-zA-Z])+/g)
      const linkName: string = match ? match[match.length - 1].slice(3) : 'name-not-found' + i
      this.images.push({ src: link, name: linkName })
    })
    this.spinnerService.stopLoading()
  }

  // async onUpdateUpload(snapshot: UploadTaskSnapshot, filename: string) {
  //   const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  // this.previews = { ...this.previews, [filename]: { ...this.previews[filename], progress } }
  // }

  deleteFile(fileName: string): void {
    console.log('Delete -> ', fileName)
  }

  async deleteArticleFiles(): Promise<void> {
    const imageNames = this.initialImages.map(img => img.name)
    const deleteImgs = this.images.filter(img => !(imageNames.includes(img.name)))
    this.images = [...this.initialImages]
    for (const img of deleteImgs) {
      console.log('delete image ', `images/${this.auctionUid}/${this.idx}/${img.name}`)
      await this.storageService.deleteFile(`${this.auctionUid}/${this.idx}/${img.name}`)
    }
  }

}
