import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import FetchApiService from '../fetch-api-data.service';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private fetchApi: FetchApiService
    ) { }
    
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const checkUserData = async (): Promise<Boolean> => {
            try {
                return await new Promise((resolve, reject) => {
                    this.fetchApi.getUserData().subscribe(() => { resolve(true) }, () => { reject(false) })
                });                        
            } catch {
                return false;
            }
        }
        
        const check: Boolean = await checkUserData();

        if (check) {
            // user logged in and user data validd
            return true
        } else {
            // user data not valid or user is not logged in => new login
            localStorage.clear();
            this.router.navigate(['/welcome']);
            return false
        }
    }
}