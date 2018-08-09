import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params, ParamMap } from '@angular/router';
import { FormControl } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { log } from 'util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GalleryService } from '../../services/gallery.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction
import { AgmCoreModule } from '@agm/core';
import {Location} from '@angular/common';

import { Map } from '../../models/map.model';
import { GoogleAPIService } from '../../services/google-api.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  // google API
  // goole maps API
  @ViewChild('search') public searchElement: ElementRef;
  @ViewChild('search2') public searchElement2: ElementRef;

  @ViewChild('map') public mapElement;
  map;
  service;
  directionsService;
  directionsDisplay;
  latitude = -33.8688;
  longtitude = 151.2195;
  zoom: number;
  locationChosen = false;
  marker = {
    coords: {
      lat: <number>null,
      lng: <number>null,
    }
  };
  markers = [];
  // directions
  public lat: Number;
  public lng: Number;

  public origin: {};
  public destination: {};
  public origin2: {};
  public destination2: {};
  public waypoints: any = [];
  public renderOptions = {
    draggable: true
  };
  eventId: string;

  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private goolgeService: GoogleAPIService,
    private _location: Location) { }

  ngOnInit() {
    // this.eventService.editId.subscribe((id: string) => {
    //   this.eventId = id;

    // });
    // this.eventId = this.eventService.getEventId();
    this.route.paramMap
      .subscribe(
        (paramMap: ParamMap) => {
          if (paramMap.has('id')) {
            this.eventId = paramMap.get('id');
            this.eventService.httpGetMap(this.eventId)
            .subscribe((data) => {
               this.map = data.map;
               this.origin = this.map.origin;
               this.destination = this.map.destination;
               this.waypoints = this.map.waypoint;
               this.markers = this.map.markers;
                console.log('mapINFO', this.map);
                // this.eventChanged.next(this.events.slice());
              });
          }
          });



    // this.setCurrentPosition();
    this.mapsAPILoader.load().then(
      () => {
        // tslint:disable-next-line:prefer-const
        let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement,
          { types: [] });
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longtitude = place.geometry.location.lng();
            this.zoom = 8;
            this.marker.coords.lat = this.latitude;
            this.marker.coords.lng = this.longtitude;
            this.markers.push(this.marker);
            this.addMarker(this.marker);

          });
        }); // .autocomplete1

        // autocomplete 2
        const autocomplete2 = new google.maps.places.Autocomplete(this.searchElement2.nativeElement,
          { types: [] });
        autocomplete2.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete2.getPlace();
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            // set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longtitude = place.geometry.location.lng();
            this.zoom = 8;
            this.marker.coords.lat = this.latitude;
            this.marker.coords.lng = this.longtitude;
            this.markers.push(this.marker);
            // this.addMarker(this.marker);

          });
        }); // .autocomplete1


      });
    //
  }

  // addMarker(event) {
  //   this.goolgeService.addMarker(event , this.latitude, this.longtitude,
  //      this.locationChosen, this.markers, this.waypoints);
  // }

  backClicked() {
    this._location.back();
}

  // GOOGLE MAP API
  addMarker(event) {
    this.latitude = event.coords.lat;
    this.longtitude = event.coords.lng;
    this.locationChosen = true;
    // console.log(event);
    this.markers.push({
      coords: {
        lat: this.latitude,
        lng: this.longtitude
      }
    });
    // this.waypoints.push(new google.maps.LatLng(event.coords.lat, event.coords.lng));
    this.waypoints.push({ location: this.latitude + ',' + this.longtitude });
    // console.log(this.markers[0]);
    // console.log(this.searchElement);
    console.log(this.waypoints);
    // console.log(event.coords.lat);

  }

  private setCurrentPosition() {

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longtitude = position.coords.longitude;
        this.zoom = 12;
        this.marker.coords.lat = this.latitude;
        this.marker.coords.lng = this.longtitude;
        this.addMarker(this.marker);
        // console.log(marker);
        // console.log('dsd');

      });
    }
  }
  // // не работи
  // calculateAndDisplayRoute(directionsService, directionsDisplay) {
  //   directionsService.route({
  //     origin: this.searchElement.nativeElement.value,
  //     destination: this.searchElement2.nativeElement.value,
  //     // waypoints: '',
  //     travelMode: 'DRIVING',
  //     avoidTolls: true
  //   }, function (response, status) {
  //     if (status === 'OK') {
  //       directionsDisplay.setDirections(response);
  //     } else {
  //       window.alert('Directions request failed due to ' + status);
  //     }
  //   });
  // }

  saveMap() {
    this.map = {};
    this.map.origin = this.origin;
    this.map.destination = this.destination;
    this.map.waypoints = this.waypoints;
    this.map.markers = this.markers;
    this.eventService.httpAddMap(this.eventId, this.map);
  }
  getDirection() {
    this.origin = { lat: this.markers[0].coords.lat, lng: this.markers[0].coords.lng };
    this.destination = { lat: this.markers[1].coords.lat, lng: this.markers[1].coords.lng };
    console.log(this.origin, this.destination, this.waypoints, this.markers);
    // const map = new Map(this.origin,this.destination, this.waypoints, this.markers);

    console.log(this.map);
  }

  // waypoint
  public change(event: any) {
    this.waypoints = event.request.waypoints;
    console.log('on change');
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

}
