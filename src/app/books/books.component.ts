import { Component, OnInit } from '@angular/core';
import { BooksService } from './books.service';
import { Book } from '../types/Book';
import { BooksModule } from './books.module';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit, BooksModule {

  books: Array<Book> = []

  showContent: boolean = true;

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
    this.books = this.booksService.getBooks()
  }

  toggleTitle() {
    this.showContent = !this.showContent
  }

}
