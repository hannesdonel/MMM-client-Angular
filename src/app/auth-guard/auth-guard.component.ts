import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import FetchApiService from '../fetch-api-data.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private fetchApi: FetchApiService
    ) { }
    
    /** Checks if a user is logged in or not and grants access respectively request user to log in.
     * 
     * @async
    */
    canActivate = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> => {

        // Checks if the user data in local storage is a valid user on server.
        const checkUserData = async (): Promise<boolean> => {
            try {
                return await new Promise((resolve, reject) => {
                    this.fetchApi.getUserData().subscribe(() => { resolve(true) }, () => { reject(false) })
                });                        
            } catch {
                return false;
            }
        }
        
        const check: boolean = await checkUserData();

        if (check) {
            // User logged in and user data valid
            return true
        } else {
            // User data not valid or user is not logged in => new login
            localStorage.clear();
            localStorage.setItem('redirectURL', state.url);
            this.router.navigate(['/welcome']);
            return false
        }
    }
}