import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import FetchApiService from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
  
class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { user_name: '', password: '', email: '', birth_date: '' };

  constructor(
    public fetchApi: FetchApiService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.fetchApi.userRegistration(this.userData).subscribe((result) => {
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