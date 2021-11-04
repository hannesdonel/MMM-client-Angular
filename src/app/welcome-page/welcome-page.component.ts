import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import UserRegistrationFormComponent from '../user-registration-form/user-registration-form.component';
import LoginFormComponent from '../login-form/login-form.component';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
class WelcomePageComponent implements OnInit {
  constructor(
    private dialog: MatDialog,
    private app: AppComponent
  ) { }
  
  user = localStorage.getItem('username')
  firstLogin = localStorage.getItem('firstLogin')

  ngOnInit(): any {
    this.app.setLoggedIn(false);
  }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginFormComponent);
  }
}

export default WelcomePageComponent;