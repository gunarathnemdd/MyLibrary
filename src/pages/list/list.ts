import { Component } from '@angular/core';
import { NavController, Platform, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { forEach } from 'lodash';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  book = {};
  private form: FormGroup;
  public tab: any = 'informations';
  public information: any = 'active';
  public notes: any = 'deactive';
  public lendByDivClass: any = 'display-none';
  public awardsDivClass: any = 'display-none';
  public awardDetails: string = "";

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
      book_id: ['', Validators.required],
      title: ['', Validators.required],
      title_english: ['', Validators.required],
      authour: ['', Validators.required],
      note: ['', Validators.required],
      category: ['', Validators.required],
      price: ['', Validators.required],
      pages: ['', Validators.required],
      first_published_date: ['', Validators.required],
      published_date: ['', Validators.required],
      publisher: ['', Validators.required],
      isbn: ['', Validators.required],
      volume: ['', Validators.required],
      is_read: ['', Validators.required],
      isBookLend: ['false'],
      isAwardReceived: ['false'],
      special_note: [''],
      awards: this._FB.array([
        this.initAwardsFields()
      ]),
      lend: this._FB.array([
        this.initLendFields()
      ])
    });
  }

  initAwardsFields() {
    return this._FB.group({
      award_name: [{ value: '', disabled: true }, Validators.required],
      award_year: [{ value: '', disabled: true }, Validators.required],
      award_status: [{ value: '', disabled: true }, Validators.required]
    });
  }

  initLendFields() {
    return this._FB.group({
      lend_name: [{ value: '', disabled: true }, Validators.required],
      lend_date: [{ value: '', disabled: true }, Validators.required]
    });
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

  addBook() {
    this.awardDetails = "";
    if (this.form.valid) {
      console.log(this.form.value);
      let book_id = this.form.value['book_id'];
      let title = this.form.value['title'];
      let title_english = this.form.value['title_english'];
      let authour = this.form.value['authour'];
      let note = this.form.value['note'];
      let category = this.form.value['category'];
      let price = this.form.value['price'];
      let pages = this.form.value['pages'];
      let first_published_date = this.form.value['first_published_date'];
      let published_date = this.form.value['published_date'];
      let publisher = this.form.value['publisher'];
      let isbn = this.form.value['isbn'];
      let volume = this.form.value['volume'];
      let is_read = this.form.value['is_read'];
      let special_note = this.form.value['special_note'];
      let awards = this.form.value['awards'];
      let lend = this.form.value['lend'];
      let lend_name = '';
      let lend_date = '';
      let icon;

      forEach(awards, (value) => {
        let awardDetails = '{' + '"title": "' + value["award_name"] + '", "year": ' + value["award_year"] + ', "status": "' + value["award_status"] + '"}';
        this.awardDetails = this.awardDetails.concat("/", awardDetails);
      });
      this.awardDetails = this.awardDetails.replace('/', "");

      forEach(lend, (value) => {
        lend_name = value["lend_name"];
        lend_date = value["lend_date"];
      });

      if (is_read == 1) { icon = 'md-checkbox-outline' }
      else if (is_read == 2) { icon = 'ios-bookmarks-outline' }
      else { icon = 'md-bookmarks' }

      this.databaseProvider.addBook(book_id, title, title_english, authour, note, category, price, pages, first_published_date, published_date, publisher, isbn, volume, is_read, special_note, this.awardDetails, lend_name, lend_date, icon)
        .then(data => {
          console.log('book added');
          if (data == 'book added') {
            this.form.reset();
            this.awardsDivClass = 'display-none';
            this.lendByDivClass = 'display-none';
            let message = "Book is added successfully.";
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

  alert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

}
