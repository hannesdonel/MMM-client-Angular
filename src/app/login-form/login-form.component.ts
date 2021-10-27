import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import FetchApiService from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})

class LoginFormComponent implements OnInit {

  @Input() userData = { user_name: '', password: '' };

  constructor(
    public fetchApi: FetchApiService,
    public dialogRef: MatDialogRef<LoginFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  userLogin(): void {
    this.fetchApi.login(this.userData).subscribe((result) => {
      console.log(result);
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