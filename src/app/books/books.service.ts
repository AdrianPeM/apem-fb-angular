import { Book } from '../types/Book';

export class BooksService {

  constructor() { }

  getBooks(): Array<Book> {
    return [
      {
        title: 'First book',
        author: 'First author',
        src: 'https://cdn-icons-png.flaticon.com/512/1088/1088537.png',
        price: 150,
      },
      {
        title: 'Second book',
        author: 'Second author',
        src: 'https://cdn.windowsreport.com/wp-content/uploads/2020/10/IMG-file-1200x900.jpg',
        price: 250,
      },
      {
        title: 'Third book',
        author: 'Third author',
        src: 'https://www.shutterstock.com/image-vector/img-file-document-icon-260nw-1356672041.jpg',
        price: 350,
      },
      {
        title: 'Fourth book',
        author: 'Fourth author',
        src: 'https://www.shutterstock.com/image-vector/amazing-vector-icon-img-file-260nw-2260069183.jpg',
        price: 450,
      },
    ]
  }
}
