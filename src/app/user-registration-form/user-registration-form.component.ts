import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import FetchApiService from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
  
class UserRegistrationFormComponent implements OnInit {
  constructor(
    private fetchApi: FetchApiService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    private snackBar: MatSnackBar,
  ) { }

  // Custom validation
  passwordCheckValidator = (): ValidatorFn => {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.root.get('password')?.value;    
      const passwordCheck = group.value;
      return password === passwordCheck ? null : {passwordCheck: {value: true}};
    };
  }

  loading: boolean = false
  userDataForm: FormGroup = this.fb.group({
    user_name: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    passwordCheck: ['', Validators.compose([Validators.required, this.passwordCheckValidator()])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    birth_date: ['', Validators.required],
  })

  // Get form controls
  get user_name() { return this.userDataForm.get('user_name'); }
  get password() { return this.userDataForm.get('password'); }
  get passwordCheck() { return this.userDataForm.get('passwordCheck'); }
  get email() { return this.userDataForm.get('email'); }
  get birth_date() { return this.userDataForm.get('birth_date'); }

  ngOnInit(): void {
  }

  registerUser(): void {
    this.loading = true;
    this.fetchApi.userRegistration(this.userDataForm.value).subscribe((result) => {
    this.dialogRef.close();
    localStorage.setItem('username', this.userDataForm.value.user_name);
    localStorage.setItem('firstLogin', 'true');
    this.snackBar.open(`Hi ${this.userDataForm.value.user_name}. Please login.`, 'OK', { duration: 5000 });
    this.loading = false;
    }, (result) => {
      this.snackBar.open('Something went wrong.', 'OK', { duration: 5000 });
      this.loading = false;
    });
  }
}

export default UserRegistrationFormComponent