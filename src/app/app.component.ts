import { Component } from '@angular/core';
import UserRegistrationFormComponent from './user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MMM-client-Angular';

  constructor(public dialog: MatDialog) { }

  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
    width: '40vw', maxWidth: '350px'
    });
  }
}
