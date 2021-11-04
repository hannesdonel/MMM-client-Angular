import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard} from './auth-guard/auth-guard.component';

import UserRegistrationFormComponent from './user-registration-form/user-registration-form.component';
import LoginFormComponent from './login-form/login-form.component';
import MovieCardComponent from './movie-card/movie-card.component';
import WelcomePageComponent from './welcome-page/welcome-page.component';
import { GenreComponent } from './genre/genre.component';
import { ActorsComponent } from './actors/actors.component';
import { SynopsisComponent } from './synopsis/synopsis.component';
import { UserDataComponent } from './user-data/user-data.component';
import { AccountDeletionComponent } from './account-deletion/account-deletion.component';
import { DirectorDetailsComponent } from './director-details/director-details.component';

const appRoutes: Routes = [
  { path: 'welcome', component: WelcomePageComponent },
  { path: 'movies', component: MovieCardComponent, canActivate: [AuthGuard] },
  { path: 'movies/:title', component: MovieCardComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserDataComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'welcome', pathMatch: 'prefix' },
  { path: '**', redirectTo: 'movies' },
];

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationFormComponent,
    LoginFormComponent,
    MovieCardComponent,
    WelcomePageComponent,
    GenreComponent,
    ActorsComponent,
    SynopsisComponent,
    UserDataComponent,
    AccountDeletionComponent,
    DirectorDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthGuard, MovieCardComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }
