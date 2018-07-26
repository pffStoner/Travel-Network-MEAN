import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { EventService } from './event.service';
import { Event } from '../models/event.model';
import { AuthService } from './auth.service';


@Injectable()
export class DataStorageService {
    constructor(private http: Http,
        private eService: EventService,
        private authService: AuthService
     ) {
    }
    // vrushta ni observable za koito sme subsribe i moje da go izpolzvame drugade
    storeEvents() {
        const token = this.authService.getToken();

        return this.http.put('https://travelnetwork-db40e.firebaseio.com/events.json?auth='
        + token,
     this.eService.getEvents());
    }
    getEvents() {
        const token = this.authService.getToken();
        // map-vame zashtot moje da ni vurne obekt bez nqkoi poleta i posle da poluchim greshki
        // pri opit za rabota s tqh
        this.http.get('https://travelnetwork-db40e.firebaseio.com/events.json?auth=' + token)
    /*    .map(
            (response: Response) => {
                /// proverqvame dali ima takova property i ako nqma dobavqme prazno,
                // taka nqma da pravi problemi
                for (const event of events) {
                    if (!event['task']) {
                        event['task'] = [];
                    }
                }
                return events;
            }
        )*/
        .subscribe(
            (response: Response) => {
                const events: Event[] = response.json();

                this.eService.setEvents(events);
            }
        );
    }
}
