import { Component, OnInit, ElementRef, NgZone, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
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

import { } from '@types/googlemaps';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  event: Event;
  id;
  realId: string;
  userAuth = false;
  authListenerSubs: Subscription;
  userId: string;
  taskIndex;
  username: string;


  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private tru: GalleryService,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          // this.event = this.eventService.getEvent(this.id);
          this.eventService.getEvent(this.id)
            .subscribe(eventData => {
              this.event = {
                id: eventData._id,
                name: eventData.name,
                description: eventData.description,
                img: eventData.img,
                tasks: eventData.tasks,
                createdBy: eventData.createdBy,
                startDate : eventData.startDate,
                endDate : eventData.endDate,
                map: eventData.map,
                gallery: eventData.gallery
              };
              console.log(this.event);

            });
          //  this.realId = this.event.id;
          this.eventService.editId.next(this.id);
          this.eventService.getId(this.id);

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
    this.userId = this.authService.getUserId();
    //    // console.log(this.realId);

    // this.eventService.getId(this.id);
    // console.log(this.event.createdBy);
    console.log(this.event);
    // google API

    // get username
    this.authService.userNameSubject.subscribe( username => {
      this.username = username;
      console.log(username);
    });
    this.username = this.authService.getUsername();

  }



  // navigation
  toMap() {
    this.eventService.editId.next(this.id);
    this.router.navigate(['map'], { relativeTo: this.route });
  }
  onGallery() {
    this.eventService.editId.next(this.id);
    this.router.navigate(['gallery'], { relativeTo: this.route });
  }
  onAddToShoppingList() {
    // TODO: DA STANE .tasks
    this.eventService.addTaskToTaskList(this.event.tasks);
    console.log(this.event);
  }

  onAddToTaskList(task: Task) {
    task.userId = this.userId;
    this.eventService.addToUserTaskList(task);
    console.log(task);
    this.eventService.httpTaskToUser(this.event.id, this.userId, task._id, false);
    console.log('useid', this.userId);
    console.log(this.event.id);

  }
  onRemoveFromTaskList(task: Task) {
    task.userId = null;
    this.eventService.httpTaskToUser(this.event.id, null, task._id, false);
  }
  onEditEvent() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.event.id, 'edit'], {relativeTo: this.route});
    console.log(this.realId);
  }
  onDeleteEvent() {
    // this.eventService.deleteEvent(this.id);
    console.log(this.event.id);
    this.eventService.httpDeleteEvent(this.id);
    this.router.navigate(['/events']);
  }
  joinEvent() {
    this.eventService.httpJoinEvent(this.event.id, this.userId, this.username);
    console.log('join member');
    }
    cancelEvent() {
      this.eventService.httpCancelEvent(this.event.id, this.userId, this.username);
      console.log('cancel member');

    }



}
