import { Component, ViewChild } from '@angular/core';
import { NavController, Content, AlertController, ToastController } from 'ionic-angular';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-wish-list',
  templateUrl: 'wish-list.html',
})
export class WishListPage {
  @ViewChild(Content) content: Content;

  public books: any = [];
  public oldBooks: any = [];
  public category: any = 'all';
  public isSearchBarOpened: boolean = false;
  public myInput: any = '';

  constructor(
    public navCtrl: NavController,
		public toastCtrl: ToastController,
		private alertCtrl: AlertController,
    private databaseProvider: DatabaseProvider) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getWishList();
      }
      else {
        this.loadTestData();
      }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WishListPage');
    this.getWishList();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  getWishList() {
    this.databaseProvider.getWishList().then(data => {
      this.books = data;
      this.oldBooks = this.books;
    })
  }

  searchByName(event) {
    this.scrollToTop();
    let searchText = event.target.value;
    if (searchText != "") {
      this.databaseProvider.getWishListByName(searchText).then(data => {
        this.books = data;
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

  deleteBook(id) {
		let alert = this.alertCtrl.create({
			title: 'Confirm Delete!',
			message: 'Do you want to delete this book?',
			buttons: [{
				text: 'Cancel',
				role: 'cancel'
			},
			{
				text: 'Delete',
				handler: () => {
					this.databaseProvider.deleteWishList(id).then(data => {
						if (data == 'deleted wish list') {
							let message = "Book is deleted successfully from wish list.";
							this.alert(message);
							this.getWishList();
						}
						else {
							let message = "Database error! Please try again.";
							this.alert(message);
						}
					})
				}
			}]
		});
		alert.present();
  }
  
  alert(message) {
		let toast = this.toastCtrl.create({
			message: message,
			duration: 5000,
			position: 'bottom'
		});
		toast.present();
	}

  loadTestData() {
    console.log('not loaded');
    this.books = [
      {
        row_id: 1,
        title: 'කවිකඳුර',
        title_english: 'Kavikandura',
        authour: 'සුනේත්‍රා රාජකරුණානායක'
      },
      { row_id: 2, title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්'}
    ];
    console.log(this.books);
  }

}
