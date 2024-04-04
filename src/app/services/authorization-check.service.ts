import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthorizationCheckService implements CanActivate {

    constructor(private router: Router) { }
    public modules = [];

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        //If token data exist, user may login to application

        // if (this.modules.length == 0) {
        //     this.modules = localStorage.getItem('modules').split(',');
        // }
        
        // let redirectedURL = state.url.replace('/', '');
        // && this.modules.includes(redirectedURL)

        if (localStorage.getItem('token')) {
            return true;
        }
        localStorage.clear();
        // otherwise redirect to login page with the return url
        this.router.navigate(['/auth/signin']); // , { queryParams: { returnUrl: state.url } }
        return false;
    }
}