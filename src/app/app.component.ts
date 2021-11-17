import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApplicationRef } from '@angular/core';

import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'MMM-client-Angular';

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private overlay: OverlayContainer
  ) {}

  /** Determines loader on top of page. */
  loading: boolean = false
  loggedIn: boolean = false
  /** Alters title depending on screensize. */
  dynamicTitle: string = 'MMM'
  /** Determines which menu symbol is highlighted. */
  navigationHome: boolean = true
  /** Determines which menu symbol is highlighted. */
  navigationUser: boolean = false
  /** Checks if a preffered setting is stored in localStorage. */
  darkModeStorage: string = localStorage.getItem('isDarkMode')! || 'false'
  isDarkMode: boolean = JSON.parse(this.darkModeStorage)

  ngOnInit(): void {
    this.getWindowWidth();
    window.addEventListener('resize', this.getWindowWidth);
    this.checkTheme();
  }
  
  /** Checks screen width and then sets a long or short page title. */
  getWindowWidth = (): void => {
    if (window.innerWidth < 768) {
      this.dynamicTitle = 'MMM'
    } else {
      this.dynamicTitle = 'More Movie Metadata'
    }
  }
 
  /** Sets login status. */
  public setLoggedIn(value: boolean): void {
    this.loggedIn = value;
  }

  /** Switch between light and dark mode. */
  switchTheme = (): void => {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.checkTheme();
  }

  /** Fixes problem with Material container elements and witching between light and dark mode. */
  checkTheme = (): void => {
    if (this.isDarkMode) {
      this.overlay.getContainerElement().classList.add('dark-theme-mode');
    } else {
      this.overlay.getContainerElement().classList.remove('dark-theme-mode');
    }
  }
  
  /** Navigates to home. */
  toHome(): void {
    this.router.navigate(['/movies']);
  }
  
  /** Navigates to user view. */
  toUser(): void {
    this.router.navigate(['user']);
  }

  /** Logs user out. */
  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.snackBar.open('You\'ve logged out.', 'OK', { duration: 5000 });
    this.router.navigate(['']);
  }
}
