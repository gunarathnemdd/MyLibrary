import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http'; 
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { BookDetailsPage } from '../pages/book-details/book-details';
import { EditBookPage } from '../pages/edit-book/edit-book';
import { ToReadPage } from '../pages/to-read/to-read';
import { AddToWishListPage } from '../pages/add-to-wish-list/add-to-wish-list';
import { WishListPage } from '../pages/wish-list/wish-list';

import { DatabaseProvider } from '../providers/database/database';

import { AutohideDirective } from '../directives/autohide/autohide';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    BookDetailsPage,
    EditBookPage,
    ToReadPage,
    AddToWishListPage,
    WishListPage,
    AutohideDirective
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    BookDetailsPage,
    EditBookPage,
    ToReadPage,
    AddToWishListPage,
    WishListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,
    SQLitePorter,
    SQLite
  ]
})
export class AppModule {}
