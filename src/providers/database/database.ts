import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/Rx';
import { Storage } from '@ionic/storage';

@Injectable()
export class DatabaseProvider {

  database: SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
 
  constructor(
    public sqlitePorter: SQLitePorter, 
    private storage: Storage, 
    private sqlite: SQLite, 
    private platform: Platform, 
    private http: Http) {
    this.databaseReady = new BehaviorSubject(false);
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'books.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.storage.get('database_filled').then(val => {
            if (val) {
              this.databaseReady.next(true);
            } else {
              this.fillDatabase();
            }
          });
        });
    });
  }
 
  fillDatabase() {
    this.http.get('assets/dummyDump.sql')
      .map(res => res.text())
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(data => {
            this.databaseReady.next(true);
            this.storage.set('database_filled', true);
          })
          .catch(e => console.error(e));
      });
  }
 
  addBook(book_id, title, title_english, authour, note, category, price, pages, first_published_date, published_date, publisher, isbn, volume, is_read, special_note, awardDetails, lend_name, lend_date, icon) {
    let data = [book_id, title, title_english, authour, note, icon, category, first_published_date, published_date, publisher, volume, pages, isbn, price, awardDetails, is_read, lend_name, lend_date, special_note];
    return this.database.executeSql("INSERT INTO books (book_id, title, title_english, authour, note, icon, category, fpublished_date, published_date, publisher, volume, pages, isbn, price, awards, is_read, lend_name, lend_date, special_note) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data).then(data => {
      return 'book added';
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  addToWishList(title, title_english, authour) {
    let data = [title, title_english, authour];
    return this.database.executeSql("INSERT INTO wishList (title, title_english, authour) VALUES (?, ?, ?)", data).then(data => {
      return 'added to wish list';
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }

  editBook(row_id, note, is_read, special_note, lend_name, lend_date, icon) {
    let data = [note, icon, is_read, lend_name, lend_date, special_note, row_id];
    return this.database.executeSql("UPDATE books SET note = ?, icon = ?, is_read = ?, lend_name = ?, lend_date = ?, special_note = ? WHERE id = ?", data).then(data => {
      return 'book updated';
    }, err => {
      console.log('Error: ', err);
      return err;
    });
  }
 
  getAllBooks() {
    return this.database.executeSql("SELECT * FROM books ORDER BY title_english", []).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            id: data.rows.item(i).book_id, 
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour, 
            note: data.rows.item(i).note, 
            icon: data.rows.item(i).icon,
            category: data.rows.item(i).category,
            fpublished_date: data.rows.item(i).fpublished_date,
            published_date: data.rows.item(i).published_date,
            publisher: data.rows.item(i).publisher,
            volume: data.rows.item(i).volume,
            pages: data.rows.item(i).pages,
            isbn: data.rows.item(i).isbn,
            price: data.rows.item(i).price,
            awards: data.rows.item(i).awards,
            is_read: data.rows.item(i).is_read,
            lend_name: data.rows.item(i).lend_name,
            lend_date: data.rows.item(i).lend_date,
            special_note: data.rows.item(i).special_note,
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getBooksByCategory(category) {
    let data = [category];
    return this.database.executeSql("SELECT * FROM books WHERE category = ? ORDER BY title_english", data).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            id: data.rows.item(i).book_id, 
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour, 
            note: data.rows.item(i).note, 
            icon: data.rows.item(i).icon,
            category: data.rows.item(i).category,
            fpublished_date: data.rows.item(i).fpublished_date,
            published_date: data.rows.item(i).published_date,
            publisher: data.rows.item(i).publisher,
            volume: data.rows.item(i).volume,
            pages: data.rows.item(i).pages,
            isbn: data.rows.item(i).isbn,
            price: data.rows.item(i).price,
            awards: data.rows.item(i).awards,
            is_read: data.rows.item(i).is_read,
            lend_name: data.rows.item(i).lend_name,
            lend_date: data.rows.item(i).lend_date,
            special_note: data.rows.item(i).special_note,
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getBooksByName(name) {
    let data = ['%' + name + '%'];
    return this.database.executeSql("SELECT * FROM books WHERE title_english LIKE ? ORDER BY title_english", data).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            id: data.rows.item(i).book_id, 
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour, 
            note: data.rows.item(i).note, 
            icon: data.rows.item(i).icon,
            category: data.rows.item(i).category,
            fpublished_date: data.rows.item(i).fpublished_date,
            published_date: data.rows.item(i).published_date,
            publisher: data.rows.item(i).publisher,
            volume: data.rows.item(i).volume,
            pages: data.rows.item(i).pages,
            isbn: data.rows.item(i).isbn,
            price: data.rows.item(i).price,
            awards: data.rows.item(i).awards,
            is_read: data.rows.item(i).is_read,
            lend_name: data.rows.item(i).lend_name,
            lend_date: data.rows.item(i).lend_date,
            special_note: data.rows.item(i).special_note,
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDidNotReadBooks() {
    let data = [2, 3];
    return this.database.executeSql("SELECT * FROM books WHERE is_read in (?, ?) ORDER BY is_read, title_english", data).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            id: data.rows.item(i).book_id, 
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour, 
            note: data.rows.item(i).note, 
            icon: data.rows.item(i).icon,
            category: data.rows.item(i).category,
            fpublished_date: data.rows.item(i).fpublished_date,
            published_date: data.rows.item(i).published_date,
            publisher: data.rows.item(i).publisher,
            volume: data.rows.item(i).volume,
            pages: data.rows.item(i).pages,
            isbn: data.rows.item(i).isbn,
            price: data.rows.item(i).price,
            awards: data.rows.item(i).awards,
            is_read: data.rows.item(i).is_read,
            lend_name: data.rows.item(i).lend_name,
            lend_date: data.rows.item(i).lend_date,
            special_note: data.rows.item(i).special_note,
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getDidNotReadBooksByName(name) {
    let data = ['%' + name + '%', 2, 3];
    return this.database.executeSql("SELECT * FROM books WHERE title_english LIKE ? AND is_read in (?, ?) ORDER BY is_read, title_english", data).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            id: data.rows.item(i).book_id, 
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour, 
            note: data.rows.item(i).note, 
            icon: data.rows.item(i).icon,
            category: data.rows.item(i).category,
            fpublished_date: data.rows.item(i).fpublished_date,
            published_date: data.rows.item(i).published_date,
            publisher: data.rows.item(i).publisher,
            volume: data.rows.item(i).volume,
            pages: data.rows.item(i).pages,
            isbn: data.rows.item(i).isbn,
            price: data.rows.item(i).price,
            awards: data.rows.item(i).awards,
            is_read: data.rows.item(i).is_read,
            lend_name: data.rows.item(i).lend_name,
            lend_date: data.rows.item(i).lend_date,
            special_note: data.rows.item(i).special_note,
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getWishList() {
    return this.database.executeSql("SELECT * FROM wishList ORDER BY title_english", []).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  getWishListByName(name) {
    let data = ['%' + name + '%'];
    return this.database.executeSql("SELECT * FROM wishList WHERE title_english LIKE ? ORDER BY title_english", data).then((data) => {
      let books = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          books.push({ 
            row_id: data.rows.item(i).id,
            title: data.rows.item(i).title, 
            title_english: data.rows.item(i).title_english, 
            authour: data.rows.item(i).authour
          });
        }
      }
      return books;
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  deleteBook(book_id) {
    let data = [book_id];
    return this.database.executeSql("DELETE FROM books WHERE book_id = ?", data).then((data) => {
      return 'deleted';
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }

  deleteWishList(book_id) {
    let data = [book_id];
    return this.database.executeSql("DELETE FROM wishList WHERE id = ?", data).then((data) => {
      return 'deleted wish list';
    }, err => {
      console.log('Error: ', err);
      return [];
    });
  }
 
  getDatabaseState() {
    return this.databaseReady.asObservable();
  }

}
