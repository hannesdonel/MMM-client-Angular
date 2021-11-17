import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

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
    public snackBar: MatSnackBar,
    public router: Router,
  ) { }

  /** Initiates the form of username and password to login. */
  @ViewChild('loginForm', {static: true}) loginForm!: NgForm;

  /** Activates loading spinner within the SUBMIT button. */
  loading: boolean = false
  /** If there's a user in localStorage this variable will be set with username. */
  user: string = ''
  /** If user logs in for the first time ever this variable gets stored in localStorage to then prompt a unique welcome message. */
  firstLogin: string = ''

  ngOnInit(): void {
    this.user = localStorage.getItem('username') || '';
    this.firstLogin = localStorage.getItem('firstLogin') || '';
    if (this.firstLogin) {
      setTimeout(() => this.setUsername(), 1);
      setTimeout(() => document.getElementById('password')?.focus(), 200)
    }
  }
  
  /** Prefills the username input field on first login after signup. */
  setUsername = (): void => {
    this.loginForm.setValue({ user_name: this.user, password: '' })
  }
  
  /** Handles login after SUBMIT click.
   * 
   * @param {NgForm} userData This is data passed from login form.
  */
  userLogin = (userData: NgForm): void => {
    this.loading = true;
    let loginData = userData.form.value;

    // Set username if there's one in localstorage.
    if (this.user) {
      loginData = {
        user_name: this.user,
        password: userData.form.value.password
      }
    }

    // Send data to server
    this.fetchApi.login(loginData).subscribe(
      // On success
      (result: any) => {
        let message = `Welcome back ${result.user.user_name}, you successfully logged in.`
        if (this.firstLogin) {
          message = `Welcome ${result.user.user_name}, you successfully logged in. Nice to have you here, take a look around.`
        }
        this.dialogRef.close();
        localStorage.setItem('token', result.token);
        localStorage.setItem('username', result.user.user_name);
        localStorage.setItem('id', result.user._id)
        this.snackBar.open(message, 'OK', { duration: 5000 });
        const redirectURL = localStorage.getItem('redirectURL') || '/movies';
        console.log(redirectURL);
        this.router.navigate([redirectURL]);
        localStorage.removeItem('firstLogin');
        localStorage.removeItem('redirectURL');
        this.loading = false;
      },
      // On error
      (result: any) => {
        const message = `${result.message} Try again.`
        this.snackBar.open(message, 'OK', { duration: 5000 });
        localStorage.clear();
        this.loading = false;
      }
    );
  }
}

export default LoginFormComponent;