import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

import FetchApiService from '../fetch-api-data.service';

@Component({
  selector: 'app-account-deletion',
  templateUrl: './account-deletion.component.html',
  styleUrls: ['./account-deletion.component.scss']
})
export class AccountDeletionComponent implements OnInit {

  constructor(
    private fetchApi: FetchApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router
  ) { }
  
  /** Input field where a user types DELETE to activate the deletion process. */
  @ViewChild('doubleCheckInput', {static: true}) doubleCheckInput!: NgForm;
  
  /** Activates loading spinner within the DELETE button. */
  loading: boolean = false
  /** Determines if DELETE button is shown or not. */
  showDelete: boolean = false

  ngOnInit(): void {
    this.doubleCheckInput.form.valueChanges.subscribe((value) => this.doubleCheck(value.input));
  }

  /** Check if the users input is valid. If so, the deletion button will be shown.
   * 
   * @param value String to check.
   */
  doubleCheck = (value: string): void => {
    if (value === 'DELETE') {
      this.showDelete = true;
    } else {
      this.showDelete = false;
    }
  }

  /** This function deletes the account. */
  deleteAccount = (): void => {
    this.loading = true;
    this.fetchApi.userDeregistration().subscribe(() => {
      this.router.navigate(['']);
      this.dialog.closeAll();
      this.snackBar.open('Your account has been deleted.', 'Bye');
      localStorage.clear();
      this.loading = false;
    }, () => {
      this.snackBar.open('Something went wrong. Try again.', 'OK', { duration: 5000 });
      this.loading = false;
    })
  }
}
