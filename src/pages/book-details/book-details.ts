import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Validators, FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { forEach } from 'lodash';

import { DatabaseProvider } from './../../providers/database/database';

@Component({
	selector: 'page-book-details',
	templateUrl: 'book-details.html',
})
export class BookDetailsPage {

	bookArray = {};
	public book: any;
	public image: any;
	private form: FormGroup;
	public tab: any = 'informations';
	public information: any = 'active';
	public notes: any = 'deactive';
	public isEdit: boolean = false;
	public lendByDivClass: any = 'display-none';

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public toastCtrl: ToastController,
		private alertCtrl: AlertController,
		private databaseProvider: DatabaseProvider,
		private _FB: FormBuilder) {
		this.navParams = navParams;
		this.book = this.navParams.get('book');
		if (this.book.lend_name != '') {
			this.form = this._FB.group({
				note: [this.book.note, Validators.required],
				is_read: [this.book.is_read, Validators.required],
				isBookLend: ['true'],
				special_note: [this.book.special_note],
				lend: this._FB.array([
					this.initLendFields()
				])
			});
			this.lendByDivClass = 'display';
			this.form.get('lend').enable();
		}
		else {
			this.form = this._FB.group({
				note: [this.book.note, Validators.required],
				is_read: [this.book.is_read, Validators.required],
				isBookLend: ['false'],
				special_note: [this.book.special_note],
				lend: this._FB.array([
					this.initLendFields()
				])
			});
		}
	}

	ionViewDidLoad() {
		console.log(this.book);
		this.image = "assets/imgs/logo.png";
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

	initLendFields() {
		if (this.book.lend_name != '') {
			console.log(this.book.lend_name);
			return this._FB.group({
				lend_name: [{ value: this.book.lend_name, disabled: true }, Validators.required],
				lend_date: [{ value: this.book.lend_date, disabled: true }, Validators.required]
			});
		}
		else {
			return this._FB.group({
				lend_name: [{ value: '', disabled: true }, Validators.required],
				lend_date: [{ value: '', disabled: true }, Validators.required]
			});
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
						this.book.note = note;
						this.book.is_read = is_read;
						this.book.icon = icon;
						this.book.lend_name = lend_name;
						this.book.lend_date = lend_date;
						this.book.special_note = special_note;
						this.isEdit = false;
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

	deleteBook() {
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
					this.databaseProvider.deleteBook(this.book.id).then(data => {
						if (data == 'deleted') {
							let message = "Book is deleted successfully.";
							this.alert(message);
							this.navCtrl.pop();
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
}
