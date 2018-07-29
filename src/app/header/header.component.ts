import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userAuth = false;
authListenerSubs: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
   this.userAuth = this.authService.getAuthStatus();
this.authListenerSubs =   this.authService
  .getAuthStatusListener()
  .subscribe(isAuth => {
    this.userAuth = isAuth;
  });
}
onLogout() {
  this.authService.Logout();
}

ngOnDestroy() {
  this.authListenerSubs.unsubscribe();
}

}
