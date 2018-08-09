import { Event } from '../models/event.model';
import { Task } from '../models/task.model';
import { QuestionWall } from '../models/questionWall.model';

import { EventEmitter, Injectable } from '@angular/core';
import { TaskListService } from './task-list.service';
import { Subject } from 'rxjs/Subject';
import { Gallery } from '../models/gallery.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { log } from 'util';
import { Router } from '@angular/router';
import { Map } from '../models/map.model';

@Injectable()
export class EventService {
  // eventSelected = new EventEmitter<Task>();
  editId = new Subject();
  eventChanged = new Subject();
  qaWallChanged = new Subject();
  private events: Event[];
  private qaWall: QuestionWall[];
  eventId: string;
  public eventIndex;
  constructor(private tsService: TaskListService,
    private http: HttpClient,
    private router: Router) {

  }
getEventId() {
  return this.eventId;
}
  setEvents(events: Event[]) {
    this.events = events;
    this.eventChanged.next(this.events.slice());
  }
  getEvents() {
    return this.events.slice();
  }
  getQaWall() {
    return this.qaWall;
  }

  getEvent(eventId: string) {
    return this.http.get<{
      _id: string,
      name: string,
      description: string,
      img: string,
      tasks: Task[],
      gallery: Gallery[],
      createdBy: string,
      startDate: string,
      endDate: string,
      map: Map
     }>('http://localhost:3000/api/events/' + eventId);
  }

  addTaskToTaskList(tasks: Task[]) {
    this.tsService.addTasks(tasks);
  }
  addToUserTaskList(task: Task) {
this.tsService.addTask(task);
  }
  getId(id: string) {
    this.editId.next(id);
    this.eventId = id;
  }


  httpAddEvent(event: Event) {
    this.http
      .post<{ msg: string, events: Event[], id: string, createdBy: string }>('http://localhost:3000/api/events', event)
      .subscribe(resData => {
        console.log(resData);
        const id = resData.id;
        event.id = id;
        event.createdBy = resData.createdBy;
        console.log(id);
        this.events.push(event);
        this.eventChanged.next(this.events.slice());
      });
  }
  // httpGetUserTasks(userId: string) {
  //   this.http
  //     .get<{ msg: string, events: any }>('  http://localhost:3000/api/events')
  //       .pipe(map((evetData) => {
  //         return evetData.events.map(event => {
  //           return {
  //             tasks: event.tasks,
  //           };
  //         }
  //         );
  //       }))
  //     .subscribe((data) => {
  //       const taskUpd = data.filter(event => event['tasks']['userId'] === userId);

  //       console.log(data);
  //     });
  // }


  httpGetEvents() {
    this.http
      .get<{ msg: string, events: any }>('  http://localhost:3000/api/events')
        .pipe(map((evetData) => {
          return evetData.events.map(event => {
            console.log(event);
            return {
              id: event._id,
              name: event.name,
              description: event.description,
              img: event.img,
              tasks: event.tasks,
              gallery: event.gallery,
              createdBy: event.createdBy,
              map: event.map,
              members: event.members
            };
          }
          );
        }))
      .subscribe((data) => {
        this.events = data;
        console.log(data);
        this.eventChanged.next(this.events.slice());
      });
  }

  httpDeleteEvent(eventId: string) {
    this.http
      .delete<{ msg: string }>('http://localhost:3000/api/events/' + eventId)
      .subscribe((data) => {
        console.log(data);
        const updEvent = this.events.filter(event => event.id !== eventId);
        this.events = updEvent;
        this.eventChanged.next(this.events.slice());

      });
  }

  httpUpdateEvent(eventId: string, newEvenet: Event) {
    this.http
      .put('http://localhost:3000/api/events/' + eventId, newEvenet)
      .subscribe(res => console.log(res));
  }
  httpAddMap(eventId: string, googlemap: any) {
    this.http
    .put('http://localhost:3000/api/events/map/' + eventId, googlemap)
    .subscribe(res => console.log(res));
  }
  httpGetMap(eventId: string) {
   return this.http
      .get<{ map: Map }>('http://localhost:3000/api/events/map/' + eventId);
  }
  httpTaskToUser(eventId: string, userId: string, taskId: string, taskComplete: boolean) {
    // this.http
    // .put('http://localhost:3000/api/events/addTask/' + eventId, {userId, taskId})
    // .subscribe(res => console.log(res));
    this.tsService.httpTaskToUser(eventId, userId, taskId, taskComplete)
        .subscribe(res => console.log(res));
  }

  httpJoinEvent(eventId: string, userId: string, username: string) {
        this.http
        .put('http://localhost:3000/api/events/joinEvent/' + eventId, {userId, username})
        .subscribe(res => console.log(res));
      }
      httpCancelEvent(eventId: string, userId: string, username: string) {
        this.http
        .put('http://localhost:3000/api/events/cancelEvent/' + eventId, {userId, username})
        .subscribe(res => console.log(res));
        // cancelEvent
      }

      httpAskQuestion(eventId: string, username: string,  question: string,  userId: string) {
        this.http
        .put<{question: any}>('http://localhost:3000/api/events/questions/' + eventId, {question, username, userId})
        .subscribe(data => {
          this.qaWall.push(data.question);
          this.qaWallChanged.next(this.qaWall);
           console.log(data);
          });
      }
      httpAnswerQuestion(eventId: string, username: string, questionId: string,  answer: string, userId: string) {
        this.http
        .put<{answer: any}>('http://localhost:3000/api/events/answers/' + eventId, {answer, username, questionId, userId})
        .subscribe(data => {
          // this.qaWall.push(data.answer);
          // if (this.qaWall.answers) {
          // }
          this.qaWall.forEach(element => {
            element.answers.push(data.answer);
            console.log(element.answers);
          });
          this.qaWallChanged.next(this.qaWall);
          console.log(data);
        });
      }
      httpGetQustionWall(eventId: string) {
        this.http
        .get<{questions: any, msg: string }>('http://localhost:3000/api/questions/' + eventId)
        .subscribe(res => {
          this.qaWall = res.questions;
          this.qaWallChanged.next(this.qaWall);
            console.log('WALL', res.questions);
          });
      }
}
