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
  subscribtion = new Subscription;
  userAuth = false;
  authListenerSubs: Subscription;

  constructor(private eventService: EventService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService) {

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
    this.subscribtion.unsubscribe();
  }
}
