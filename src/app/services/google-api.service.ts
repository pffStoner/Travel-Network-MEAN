import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { } from '@types/googlemaps';

@Injectable({
  providedIn: 'root'
})
export class GoogleAPIService {

  constructor(private http: HttpClient) { }

  httpGetEvents() {
    // AIzaSyCVpC92nFNJb4iSxbNkamDpsd70sa2likg
    // tslint:disable-next-line:max-line-length
    this.http.get<any>('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCVpC92nFNJb4iSxbNkamDpsd70sa2likg')
       .subscribe((data: any) => {
       // this.events = data.events;
        console.log(data);

      //  this.eventChanged.next(this.events.slice());
      });
  }
}
