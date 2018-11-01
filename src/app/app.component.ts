import { Component, ViewChild } from '@angular/core';
import { Nav, App, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ToReadPage } from '../pages/to-read/to-read';
import { AddToWishListPage } from '../pages/add-to-wish-list/add-to-wish-list';
import { WishListPage } from '../pages/wish-list/wish-list';

import { DatabaseProvider } from './../providers/database/database';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  public lastBack: any = Date.now();
  public allowClose: boolean = false;

  constructor(
    public app: App,
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public toastCtrl: ToastController,
    private databaseprovider: DatabaseProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'To Read', component: ToReadPage },
      { title: 'Wish List', component: WishListPage },
      { title: 'Add Book', component: ListPage },
      { title: 'Add To Wish List', component: AddToWishListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.databaseprovider.getDatabaseState().subscribe(rdy => {
        if (rdy) {
          console.log('database ready');
        }
      });
      this.platform.registerBackButtonAction(() => {
        const overlay = this.app._appRoot._overlayPortal.getActive();
        const nav = this.app.getActiveNavs()[0];
        const closeDelay = 2000;
        const spamDelay = 500;
        const activeView = nav.getActive();

        if (activeView.name === "HomePage") {
          if (overlay && overlay.dismiss) {
            overlay.dismiss();
          } else if (nav.canGoBack()) {
            nav.pop();
          } else if (Date.now() - this.lastBack > spamDelay && !this.allowClose) {
            this.allowClose = true;
            let toast = this.toastCtrl.create({
              message: "Press BACK again to exit",
              duration: closeDelay,
              dismissOnPageChange: true
            });
            toast.onDidDismiss(() => {
              this.allowClose = false;
            });
            toast.present();
          } else if (Date.now() - this.lastBack < closeDelay && this.allowClose) {
            this.platform.exitApp();
          }
          this.lastBack = Date.now();
        }
        else if (nav.canGoBack()) {
          nav.pop();
        }
        else {
          nav.setRoot(HomePage);
        }
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
