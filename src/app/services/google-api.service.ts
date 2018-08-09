import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { } from '@types/googlemaps';

@Injectable({
  providedIn: 'root'
})
export class GoogleAPIService {
map;
service;


  constructor(private http: HttpClient) { }
  // GOOGLE MAP API
  addMarker(event, latitude, longtitude, locationChosen, markers, waypoints) {
    latitude = event.coords.lat;
    longtitude = event.coords.lng;
    locationChosen = true;
    // console.log(event);
    markers.push({
      coords: {
        lat: latitude,
        lng: longtitude,
      }
    });
    // waypoints.push(new google.maps.LatLng(event.coords.lat, event.coords.lng));
    waypoints.push({ location: latitude + ',' + longtitude });
    // console.log(markers[0]);
    // console.log(searchElement);
    console.log(waypoints);
    // console.log(event.coords.lat);
  }






  // take map element
  mapReady($event: any) {
    const request = {
      query: 'Museum of Contemporary Art Australia',
      fields: ['photos', 'formatted_address', 'name', 'rating', 'opening_hours', 'geometry']
    };
    // here $event will be of type google.maps.Map
    // and you can put your logic here to get lat lng for marker. I have just put a sample code. You can refactor it the way you want.
    this.service = new google.maps.places.PlacesService($event);
    this.service.findPlaceFromQuery(request, this.callback);
    this.map = $event;
    console.log($event);

  }
  callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (let i = 0; i < results.length; i++) {
        const place = results[i];
        console.log(results[i]);
        //  this.createMarkers( results[i]);

      }
    }
  }
  createMarkers(places) {
    const bounds = new google.maps.LatLngBounds();
    // const placesList = document.getElementById('places');

    for (let i = 0, place; place = places[i]; i++) {
      const image = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      const marker = new google.maps.Marker({
        map: this.map,
        icon: image,
        title: place.name,
        position: place.geometry.location
      });
      console.log(marker);

      const li = document.createElement('li');
      li.textContent = place.name;
      //  placesList.appendChild(li);
      bounds.extend(place.geometry.location);
    }
    this.map.fitBounds(bounds);
  }











  // httpGetEvents() {
  //   // AIzaSyCVpC92nFNJb4iSxbNkamDpsd70sa2likg
  //   // tslint:disable-next-line:max-line-length
  //   this.http.get<any>('https://maps.googleapis.com/maps/api
  // place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&
  // fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyCVpC92nFNJb4iSxbNkamDpsd70sa2likg')
  //      .subscribe((data: any) => {
  //      // this.events = data.events;
  //       console.log(data);

  //     //  this.eventChanged.next(this.events.slice());
  //     });
  // }





}
