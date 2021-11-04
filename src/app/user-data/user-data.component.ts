import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { AppComponent } from '../app.component';
import { AccountDeletionComponent } from '../account-deletion/account-deletion.component';
import FetchApiService from '../fetch-api-data.service';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private app: AppComponent,
    private fetchApi: FetchApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  // Custom validation
  passwordCheckValidator = (): ValidatorFn => {
    return (group: AbstractControl): ValidationErrors | null => {
      const password = group.root.get('password')?.value;    
      const passwordCheck = group.value;
      return password === passwordCheck ? null : {passwordCheck: {value: true}};
    };
  }
  
  loading: Boolean = false
  userData: any = {}
  userDataForm: FormGroup = this.fb.group({
    user_name: ['', Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_]*$')])],
    password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    passwordCheck: ['', Validators.compose([Validators.required, this.passwordCheckValidator()])],
    email: ['', Validators.compose([Validators.required, Validators.email])],
    birth_date: ['', Validators.required],
  })
  
  async ngOnInit(): Promise<any> {
    this.app.navigationHome = false;
    this.app.navigationUser = true;
    this.app.setLoggedIn(true);
    await this.fetchData();
    this.initializeForm();
  }

  // Pre-populate form
  initializeForm = (): void => {
    this.userDataForm.patchValue({
      user_name: this.userData.user_name,
      password: '',
      passwordCheck: '',
      email: this.userData.email,
      birth_date: this.userData.birth_date.slice(0, 10)
    });
  }

  // Get form controls
  get user_name() { return this.userDataForm.get('user_name'); }
  get password() { return this.userDataForm.get('password'); }
  get passwordCheck() { return this.userDataForm.get('passwordCheck'); }
  get email() { return this.userDataForm.get('email'); }
  get birth_date() { return this.userDataForm.get('birth_date'); }

  // Form submit
  onSubmit = (): void => {
    this.loading = true;
    this.fetchApi.updateUserData(this.userDataForm.value).subscribe(() => {
      localStorage.setItem('username', this.userDataForm.value.user_name);
      this.snackBar.open('Your data has been successfully changed', 'OK', { duration: 3000 });
      this.loading = false;
    },  
    () => {
      this.snackBar.open('Something went wrong, please try again.', 'OK', { duration: 3000 });
    })  
  }  

  // Delete Account
  onDeletion = (): void => {
    if (this.userDataForm.valid) {
      console.log('erase');
      this.dialog.open(AccountDeletionComponent);      
    } else {
      console.log('validate');
      this.userDataForm.markAllAsTouched();
    }
  }  

  // Api
  fetchData = async () => {
    this.app.loading = true;
    try {
      await new Promise((resolve) => {
        // Get user data
        this.fetchApi.getUserData().subscribe((response: any) => {
          this.userData = response.user;
          resolve(true);
        })
      });

      this.app.loading = false;
      return true
    } catch {
      this.app.loading = false;
      return false
    }
  }
}
