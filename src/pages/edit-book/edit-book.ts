import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { forEach } from 'lodash';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-edit-book',
  templateUrl: 'edit-book.html',
})
export class EditBookPage {

  bookArray = {};
  public book: any;
  private form: FormGroup;
  public tab: any = 'informations';
  public information: any = 'active';
  public notes: any = 'deactive';
  public lendByDivClass: any = 'display-none';
  public awardsDivClass: any = 'display-none';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private databaseProvider: DatabaseProvider,
    private _FB: FormBuilder) {
    this.navParams = navParams;
    this.book = this.navParams.get('book');
    this.databaseProvider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        console.log('books ready');
      }
    });
    this.form = this._FB.group({
      book_id: [this.book.id, Validators.required],
      title: [this.book.title, Validators.required],
      title_english: [this.book.title_english, Validators.required],
      authour: [this.book.authour, Validators.required],
      note: [this.book.note, Validators.required],
      category: [this.book.category, Validators.required],
      price: [this.book.price, Validators.required],
      pages: [this.book.pages, Validators.required],
      first_published_date: [this.book.fpublished_date, Validators.required],
      published_date: [this.book.published_date, Validators.required],
      publisher: [this.book.publisher, Validators.required],
      isbn: [this.book.isbn, Validators.required],
      series: [this.book.series, Validators.required],
      volume: [this.book.volume, Validators.required],
      is_read: [this.book.is_read, Validators.required],
      isBookLend: ['false'],
      isAwardReceived: ['false'],
      special_note: [this.book.special_note],
      awards: this._FB.array([
        this.initAwardsFields()
      ]),
      lend: this._FB.array([
        this.initLendFields()
      ])
    });

    if (this.book.lend.length > 0) {
      this.lendByDivClass = 'display';
      this.form.get('lend').enable();
    }
  }

  initAwardsFields() {
    return this._FB.group({
      award_name: [{ value: '', disabled: true }, Validators.required],
      award_year: [{ value: '', disabled: true }, Validators.required],
      award_status: [{ value: '', disabled: true }, Validators.required]
    });
  }

  initLendFields() {
    if (this.book.lend.length > 0) {
      return this._FB.group({
        lend_name: [{ value: this.book.lend[0]['name'], disabled: true }, Validators.required],
        lend_date: [{ value: this.book.lend[0]['date'], disabled: true }, Validators.required]
      });
    }
    else {
      return this._FB.group({
        lend_name: [{ value: '', disabled: true }, Validators.required],
        lend_date: [{ value: '', disabled: true }, Validators.required]
      });
    }
  }

  setClass(tab) {
    if (tab == 'information') {
      this.information = 'active';
      this.notes = 'deactive';
      this.tab = 'informations';
    }
    else {
      this.information = 'deactive';
      this.notes = 'active';
      this.tab = 'notes';
    }
  }

  isBookLend() {
    if (this.form.value['isBookLend']) {
      this.lendByDivClass = 'display';
      this.form.get('lend').enable();
    }
    else {
      this.lendByDivClass = 'display-none';
      this.form.get('lend').disable();
    }
  }

  isAwardReceived() {
    if (this.form.value['isAwardReceived']) {
      this.awardsDivClass = 'display';
      this.form.get('awards').enable();
    }
    else {
      this.awardsDivClass = 'display-none';
      this.form.get('awards').disable();
    }
  }

  addNewInputField() {
    const control = <FormArray>this.form.controls.awards;
    control.push(this.initAwardsFields());
    this.form.get('awards').enable();
  }

  removeInputField(i: number): void {
    const control = <FormArray>this.form.controls.awards;
    control.removeAt(i);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditBookPage');
  }

  editBook() {
    if (this.form.valid) {
      console.log(this.form.value);
      let row_id = this.book.row_id;
      let note = this.form.value['note'];
      let is_read = this.form.value['is_read'];
      let special_note = this.form.value['special_note'];
      let lend = this.form.value['lend'];
      let lend_name = '';
      let lend_date = '';
      let icon;

      forEach(lend, (value) => {
        lend_name = value["lend_name"];
        lend_date = value["lend_date"];
      });

      if (is_read == 1) { icon = 'md-checkbox-outline' }
      else if (is_read == 2) { icon = 'ios-bookmarks-outline' }
      else { icon = 'md-bookmarks' }

      this.databaseProvider.editBook(row_id, note, is_read, special_note, lend_name, lend_date, icon)
        .then(data => {
          console.log('book updated');
          if (data == 'book updated') {
            this.awardsDivClass = 'display-none';
            this.lendByDivClass = 'display-none';
            let message = "Book is updated successfully.";
            this.alert(message);
          }
          else {
            let message = "Database error! Please try again.";
            this.alert(message);
          }
        });
      this.bookArray = {};
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
