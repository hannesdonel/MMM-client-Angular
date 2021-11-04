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

  loading: Boolean = false
  loggedIn: Boolean = false
  dynamicTitle: string = 'MMM'
  navigationHome: Boolean = true
  navigationUser: Boolean = false
  darkModeStorage: string = localStorage.getItem('isDarkMode')! || 'false'
  isDarkMode: Boolean = JSON.parse(this.darkModeStorage)

  ngOnInit(): void {
    this.getWindowWidth();
    window.addEventListener('resize', this.getWindowWidth);
    this.checkTheme();
  }
  
  getWindowWidth = () => {
    if (window.innerWidth < 768) {
      this.dynamicTitle = 'MMM'
    } else {
      this.dynamicTitle = 'More Movie Metadata'
    }
  }
 
  public setLoggedIn(value: boolean): void {
    this.loggedIn = value;
  }

  switchTheme = (): void => {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('isDarkMode', JSON.stringify(this.isDarkMode));
    this.checkTheme();
  }

  checkTheme = (): void => {
    if (this.isDarkMode) {
      this.overlay.getContainerElement().classList.add('dark-theme-mode');
    } else {
      this.overlay.getContainerElement().classList.remove('dark-theme-mode');
    }
  }
  
  toHome(): void {
    this.router.navigate(['/movies']);
  }

  toUser(): void {
    this.router.navigate(['user']);
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.snackBar.open('You\'ve logged out.', 'OK', { duration: 5000 });
    this.router.navigate(['']);
  }
}
