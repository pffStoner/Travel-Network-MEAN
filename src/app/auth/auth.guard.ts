import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
    /**
     *
     */
    constructor(private authServ: AuthService,
                private route: Router) {}

    canActivate(route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        const isAuth = this.authServ.getAuthStatus();
        if (!isAuth) {
        this.route.navigate(['/login']);
        }
        return isAuth;

    }
}
