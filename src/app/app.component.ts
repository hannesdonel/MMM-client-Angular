import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import UserRegistrationFormComponent from './user-registration-form/user-registration-form.component';
import LoginFormComponent from './login-form/login-form.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MMM-client-Angular';

  constructor(public dialog: MatDialog) { }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent);
  }

  openLoginDialog(): void {
    this.dialog.open(LoginFormComponent);
  }
}
