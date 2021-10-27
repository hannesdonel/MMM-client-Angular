import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import FetchApiService from '../fetch-api-data.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

class LoginFormComponent implements OnInit {
  constructor(
    public fetchApi: FetchApiService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  userLogin(userData: NgForm): void {
    this.fetchApi.login(userData.form.value).subscribe((result) => {
      this.dialogRef.close();
      const message = `Welcome back ${result.user.user_name}, you successfully logged in.`
      this.snackBar.open(message, 'OK', {
        duration: 5000
      });
    }, (result) => {
      const message = `Welcome back ${result.user.user_name}, you successfully logged in.`
      this.snackBar.open(message, 'OK', {
        duration: 5000
      });
    });
  }
}

export default LoginFormComponent;