import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
import { log } from 'util';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { GalleryService } from '../../services/gallery.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';

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
  constructor(private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private tru: GalleryService,
    private authService: AuthService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.event = this.eventService.getEvent(this.id);
          console.log(this.event.id);
          this.realId = this.event.id;
          // this.eventService.editId.next(this.realId);

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
    console.log(this.event.createdBy);
    console.log(this.userId);

  }

  onAddToShoppingList() {
    // TODO: DA STANE .tasks
    this.eventService.addTaskToTaskList(this.event.tasks);
    console.log(this.event);

  }

  onEditEvent() {

    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.event.id, 'edit'], {relativeTo: this.route});
    console.log(this.realId);
  }
  onDeleteEvent() {
    // this.eventService.deleteEvent(this.id);
    console.log(this.event.id);
    this.eventService.httpDeleteEvent(this.realId);
    this.router.navigate(['/events']);
  }
  onGallery() {
    this.eventService.editId.next(this.realId);
    this.router.navigate(['gallery'], { relativeTo: this.route });

  }

}
