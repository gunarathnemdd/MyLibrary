import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { forEach } from 'lodash';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-add-to-wish-list',
  templateUrl: 'add-to-wish-list.html',
})
export class AddToWishListPage {

  book = {};
  private form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private databaseProvider: DatabaseProvider,
    private platform: Platform,
    private alertCtrl: AlertController,
    private _FB: FormBuilder) {
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('books ready');
      }
    });
    this.form = this._FB.group({
      title: ['', Validators.required],
      title_english: ['', Validators.required],
      authour: ['', Validators.required],
    });
  }

  addBook() {
    if (this.form.valid) {
      console.log(this.form.value);
      let title = this.form.value['title'];
      let title_english = this.form.value['title_english'];
      let authour = this.form.value['authour'];

      this.databaseProvider.addToWishList(title, title_english, authour)
        .then(data => {
          console.log('book added to wish list');
          if (data == 'added to wish list') {
            this.form.reset();
            let message = "Book is added successfully to wish list.";
            this.alert(message);
          }
          else {
            let message = "Database error! Please try again.";
            this.alert(message);
          }
        });
      this.book = {};
    }
    else {
      console.log(this.form.valid);
    }
  }

  alert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

}
