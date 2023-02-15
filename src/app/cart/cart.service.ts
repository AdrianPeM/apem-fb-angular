import { Injectable } from '@angular/core';
import { Book } from '../types/Book';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: Array<Book> = []

  constructor() { }

  addBook(book: Book): void {
    this.cart.push(book)
  }

  removeBook(book: Book): void {
    this.cart = this.cart.filter(b => b.title !== book.title)
  }

  getCart(): Array<Book> {
    return []
  }
}
