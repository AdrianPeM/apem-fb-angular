import { Component, OnInit, Input } from '@angular/core';
import { CartService } from '../cart/cart.service';
import { Book } from '../types/Book';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  isInCart: boolean = false;

  @Input() book: Book = {} as Book;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.isInCart = !!this.cartService.cart.find(b => b.title === this.book.title)
  }

  addToCart(): void {
    this.isInCart = true
    this.cartService.addBook(this.book)
  }

  removeFromCart(): void {
    this.isInCart = false
    this.cartService.removeBook(this.book)
  }
}
