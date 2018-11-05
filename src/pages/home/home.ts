import { Component, ViewChild } from '@angular/core';
import { NavController, Content } from 'ionic-angular';

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
    private databaseprovider: DatabaseProvider) {
    this.databaseprovider.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.getAllBooks();
      }
      else {
        this.loadTestData();
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
    if(scroll) {
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

  loadTestData() {
    console.log('not loaded');
    this.books = [
      {
        row_id: 1,
        id: 'N/001/001',
        title: 'කවිකඳුර',
        title_english: 'Kavikandura',
        authour: 'සුනේත්‍රා රාජකරුණානායක',
        note: '2011 වසරේ ස්වර්ණ පුස්තක සම්මානය දිනා ගනුලැබූ කෘතිය වන මෙය සුනේත්‍රා රාජකරුණානායකගේ සාර්ථක නිර්මාණයකි.',
        category: 'නවකතා',
        fpublished_date: '2011-02-08',
        published_date: '2012-09-25',
        publisher: 'සරසවි ප්‍රකාශන',
        series: 7,
        volume: 5,
        pages: 213,
        isbn: 9789556712543,
        price: 550,
        icon: 'md-checkbox-outline',
        awards: '{ "title": "ස්වර්ණ පුස්තක සම්මානය", "year": 2011, "status": "සම්මානය" }/{ "title": "රාජ්‍ය සාහිත්‍ය සම්මානය", "year": 2011, "status": "නිර්දේශිත" }',
        is_read: 1,
        lend_name: 'tutu',
        lend_date: '2011-08-12',
        special_note: 'special note'
      },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' },
      { row_id: 2, id: 'T/002/001', title: 'පිටුවහල් සිත්තරී', title_english: 'Pituwahal Siththari', authour: 'මුදිතා හේරත්', note: 'එළි පෙහෙළි ලෝකයක කැලෑව සුවිශේෂිය. ප්‍රඥාවන්තිය කැලෑවේ සැඟවී සිටියි. කැළෑව එළි පෙහෙළි කළ විටද ඇය දැකිය නොහැක. මන්ද යත් සුවිශේෂත්වය එළිපෙහෙළි වී සාමාන්‍ය බවට පත්ව ඇති හෙයිනි. සාමාන්‍යජීවිතය තුල ඈ උමතු කාන්තාවකි.සාමාන්‍ය ජීවිතයෙ සැරිසරන්නන්ට මේ උමතු ගැහැනිය නිතර දෙවේලේ හමු වේ.එහෙත් සුවිශේෂත්වය තුළ ඈ ප්‍රඥාවන්තියකි. මෙය උමතු ගැහැනියක පිලිබද කතාවක් නොවේ. සාමාන්‍ය ගැහැණුන් දෙදෙනෙකු පිලිබද කතවකි. ඔබේ සිත් මානය අනුව ඔවුනට උමතු බව ආරෝපණය වීම හෝ නොවිම සිදු වේ.', category: 'පරිවර්තන', fpublished_date: '2011-02-08', published_date: '2012-09-25', publisher: 'සරසවි ප්‍රකාශන', series: 7, pages: 213, isbn: 9789556712543, price: 550, volume: 5, icon: 'ios-bookmarks-outline', awards: '{}', is_read: 3, lend_name: '', lend_date: '', special_note: '' }
    ];
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
    console.log(this.books);
  }

  showDetails(book) {
    this.navCtrl.push(BookDetailsPage, {
      book: book
    });
  }

}
