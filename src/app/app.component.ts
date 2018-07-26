import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedFeature = 'event';
  ngOnInit() {
    firebase.initializeApp({
      apiKey: 'AIzaSyAjJopCv7ujZSBzBu9soqaKL64Yslnt-e8',
      authDomain: 'travelnetwork-db40e.firebaseapp.com'
    });
  }
  onNavigate(feature: string) {
    this.loadedFeature = feature;
  }
}
