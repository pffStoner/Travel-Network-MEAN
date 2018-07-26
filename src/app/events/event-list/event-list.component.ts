import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../../models/event.model';
import { Subscription } from 'rxjs/Subscription';
import { Response } from '@angular/http';
import { DataStorageService } from '../../services/data-storage.service';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[];
  subscribtion = new Subscription;

  constructor(private eventService: EventService,
              private router: Router,
              private route: ActivatedRoute,
              private dataStorage: DataStorageService) {

  }

  ngOnInit() {
    this.eventService.httpGetEvents();
    // ako se promeni shte poluchim tuk nov array ot events
    this.subscribtion = this.eventService.eventChanged.subscribe(
        (event: Event[]) => {
          // prisvoqvame poluchenite eventi na tezi, koito izpolzvame za display
          this.events = event;
        }
    );
    //
   // this.events = this.eventService.getEvents();
  }

  onNewEvent() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }
  onSaveData() {
    this.dataStorage.storeEvents()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
    }
    // tuk ne ni trbva subscribe, zashtot sme go napravili v service-a
    fetchData() {
      this.dataStorage.getEvents();
    }
  ngOnDestroy() {
    this.subscribtion.unsubscribe();
  }
}
