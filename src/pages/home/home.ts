import { Component, ViewChild } from '@angular/core';
import { NavController, Content, LoadingController } from 'ionic-angular';

import { BookDetailsPage } from './../book-details/book-details';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;

  public books: any = [];
  public oldBooks: any = [];
  public category: any = 'all';
  public isSearchBarOpened: boolean = false;
  public myInput: any = '';

  constructor(
    public navCtrl: NavController,
    private databaseprovider: DatabaseProvider,
    public loadingCtrl: LoadingController) {
    let loading = this.loadingCtrl.create({
      content: 'Books are getting ready...',
      dismissOnPageChange: true
    });
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getAllBooks();
        loading.dismiss();
      }
      else {
        loading.present();
      }
    })
  }

  ionViewWillEnter() {
    this.getBooksByCategory(false);
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  getAllBooks() {
    this.databaseprovider.getAllBooks().then(data => {
      this.books = data;
      for (let book of this.books) {
        var awardArray: any[] = [];
        var awards = book.awards.split("/");
        for (let award of awards) {
          var a = JSON.parse(award);
          if (Object.keys(a).length != 0) {
            awardArray.push(a);
          }
        }
        book.awards = awardArray;
      }
      this.oldBooks = this.books;
    })
  }

  getBooksByCategory(scroll) {
    if (scroll) {
      this.scrollToTop();
    }
    if (this.category == 'all') {
      this.getAllBooks();
    }
    else {
      this.databaseprovider.getBooksByCategory(this.category).then(data => {
        this.books = data;
        for (let book of this.books) {
          var awardArray: any[] = [];
          var awards = book.awards.split("/");
          for (let award of awards) {
            var a = JSON.parse(award);
            if (Object.keys(a).length != 0) {
              awardArray.push(a);
            }
          }
          book.awards = awardArray;
        }
        this.oldBooks = this.books;
      })
    }
  }

  searchByName(event) {
    this.scrollToTop();
    let searchText = event.target.value;
    if (searchText != "") {
      this.databaseprovider.getBooksByName(searchText).then(data => {
        this.books = data;
        for (let book of this.books) {
          var awardArray: any[] = [];
          var awards = book.awards.split("/");
          for (let award of awards) {
            var a = JSON.parse(award);
            if (Object.keys(a).length != 0) {
              awardArray.push(a);
            }
          }
          book.awards = awardArray;
        }
      })
    }
    else {
      this.books = this.oldBooks;
    }
  }

  cancelSearchBar() {
    this.isSearchBarOpened = false;
    this.myInput = '';
    this.books = this.oldBooks;
  }

  showDetails(book) {
    this.navCtrl.push(BookDetailsPage, {
      book: book
    });
  }

}
