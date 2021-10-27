import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import FetchApiService from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
  
class UserRegistrationFormComponent implements OnInit {
  constructor(
    public fetchApi: FetchApiService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  registerUser(userData: NgForm): void {
    this.fetchApi.userRegistration(userData.form.value).subscribe((result) => {
    this.dialogRef.close();
    this.snackBar.open(result, 'OK', {
      duration: 5000
    });
    }, (result) => {
      this.snackBar.open(result, 'OK', {
        duration: 5000
      });
    });
  }
}

export default UserRegistrationFormComponent