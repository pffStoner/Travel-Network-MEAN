import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'event';
 
  constructor(private authServ: AuthService) {
  }
  ngOnInit() {
     this.authServ.autoAuthUser();
  }
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
