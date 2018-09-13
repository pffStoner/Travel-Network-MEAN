import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskListService } from '../services/task-list.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../services/event.service';
import { Map } from '../models/map.model';
import { ChatService } from '../services/chat.service';



@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[];
  events;
  userEvents;
  private subscription: Subscription;
  private joinedEventsSubs: Subscription;
  private userEventsSubs: Subscription;

  userId: string;
  tasksObj;


  constructor(
    private taskService: TaskListService,
    private authService: AuthService,
    private eventService: EventService,
  private chatServive: ChatService) {
  }

  ngOnInit() {
    this.userId = this.authService.getUserId();
    this.taskService.httpGetUserTasks(this.userId);
    // this.tasks = this.taskService.getTasks();
    this.subscription = this.taskService.tasksChanged
      .subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
        }
      );
    this.tasks = this.taskService.getTasks();

    this.taskService.httpGetUserJoinedEvents(this.userId);
    this.joinedEventsSubs = this.taskService.joinedEventsChanged
      .subscribe(
        (events: any) => {
          this.events = events;
          console.log('joined', this.events);
        }
      );
    this.events = this.taskService.getJoinedEvents();

    this.taskService.httpGetUserEvents(this.userId);
   this.taskService.userEventsChanged
      .subscribe(
      (events: any) => {
        this.userEvents = events;
        console.log('my', this.userEvents);
      }
    );
  this.userEvents = this.taskService.getUserEvents();

  }

  onRemoveFromTaskList(task: Task, index) {
    // task.userId = null;
   // this.eventService.httpTaskToUser(null, null, task._id, false);
    this.chatServive.changeStatus(null, null, task._id, false);

    this.taskService.deleteTasks(index);

  }
  onTaskComplete(task: Task, index) {
   // this.eventService.httpTaskToUser(null, null, task._id, true);
    this.taskService.deleteTasks(index);
    this.chatServive.changeStatus(null, null, task._id, true);
  }
  onEditItem(index: number) {
    this.taskService.startedEditing.next(index);
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    // this.joinedEventsSubs.unsubscribe();
  }

}
