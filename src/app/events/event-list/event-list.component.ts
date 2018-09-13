import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Event } from '../../models/event.model';
import { Subscription } from 'rxjs/Subscription';
import { Response } from '@angular/http';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[];
  еventsListenerSubs = new Subscription;
  userAuth = false;
  authListenerSubs: Subscription;
  sortOption: string;
  sortOptions: string[] = ['name', 'startDate'];
  beforeDate;
  afterDate;
data = new Date();

  constructor(private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {

  }

  ngOnInit() {
    this.eventService.httpGetStartEvents('startDate');
    // ako se promeni shte poluchim tuk nov array ot events
    this.еventsListenerSubs = this.eventService.eventChanged.subscribe(
      (event: Event[]) => {
        // prisvoqvame poluchenite eventi na tezi, koito izpolzvame za display
        this.events = event;
      }
    );
    this.userAuth = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(
        {
          next: isAuth => {
            this.userAuth = isAuth;
          }
        }
      );
  }

  onNewEvent() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
    this.еventsListenerSubs.unsubscribe();
  }

  onSortEvent(option) {
    this.eventService.httpGetEvents(option.value, this.beforeDate, this.afterDate);
  }
  onSortByDate(input: HTMLInputElement, input2: HTMLInputElement) {
    console.log(input.value);
    this.eventService.httpGetEvents('name', this.beforeDate, this.afterDate);
  }
}
