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
  
  @ViewChild('doubleCheckInput', {static: true}) doubleCheckInput!: NgForm;
    
  loading: Boolean = false
  showDelete: Boolean = false

  doubleCheck = (value: String): void => {
    if (value === 'DELETE') {
      this.showDelete = true;
    } else {
      this.showDelete = false;
    }
  }

  ngOnInit(): void {
    this.doubleCheckInput.form.valueChanges.subscribe((value) => this.doubleCheck(value.input));
  }

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
