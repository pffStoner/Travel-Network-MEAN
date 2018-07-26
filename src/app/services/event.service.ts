import { Event } from '../models/event.model';
import { Task } from '../models/task.model';
import { EventEmitter, Injectable } from '@angular/core';
import { TaskListService } from './task-list.service';
import { Subject } from 'rxjs/Subject';
import { Gallery } from '../models/gallery.model';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { log } from 'util';

@Injectable()
export class EventService {
  // eventSelected = new EventEmitter<Task>();
  editId = new Subject();

  eventChanged = new Subject();
  private events: Event[] ;

  constructor(private tsService: TaskListService,
    private http: HttpClient) {

  }

  setEvents(events: Event[]) {
    this.events = events;
    this.eventChanged.next(this.events.slice());

  }
  getEvents() {
    return this.events.slice();
  }

  getEvent(index: string) {
    return this.events[index];
  }

  addTaskToTaskList(tasks: Task[]) {
    this.tsService.addTasks(tasks);
  }
  getId(id: string) {
    this.editId.next(id);
  }

  httpAddEvent(event: Event) {
    this.http
      .post<{ msg: string, events: Event[], id }>('http://localhost:3000/api/events', event)
      .subscribe(resData => {
        console.log(resData);
        const id = resData.id;
        event.id = id;
        console.log(id);
        this.events.push(event);
        this.eventChanged.next(this.events.slice());
      });


  }
  httpGetEvents() {
   this.http
   .get<{ msg: string, events: any }>('http://localhost:3000/api/events')
   .pipe(map((evetData) => {
    return evetData.events.map(event => {
      return {
        id: event._id,
        name: event.name,
        description: event.description,
        img:  event.img,
        tasks: event.tasks,
        gallery: event.gallery
      };
    }
  );
  }))
  .subscribe((data) => {
        this.events = data;
        console.log(data);
       this.eventChanged.next(this.events.slice());
       this.editId.next('dsdsd');
      });
  }

  httpDeleteEvent(eventId: string) {
    this.http
      .delete('http://localhost:3000/api/events/' + eventId)
      .subscribe( ( data) => {
        console.log(data);
        const updEvent = this.events.filter(event => event.id !== eventId);
        this.events = updEvent;
        console.log(this.events);

        this.eventChanged.next(...this.events);
        this.editId.next(...this.events);

      });
  }

  httpUpdateEvent(eventId: string, newEvenet: Event) {
    this.http
      .put('http://localhost:3000/api/events/' + eventId, newEvenet)
      .subscribe(res => console.log(res));
  }

}
