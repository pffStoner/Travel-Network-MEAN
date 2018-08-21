import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskListService } from '../services/task-list.service';
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from '../auth/auth.service';
import { EventService } from '../services/event.service';
import { Map } from '../models/map.model';



@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[];
  private subscription: Subscription;
  userId: string;
  tasksObj;


  constructor(
    private taskService: TaskListService,
    private authService: AuthService,
  private eventService: EventService) {
   }

   ngOnInit() {
    this.userId = this.authService.getUserId();
    this.taskService.httpGetUserTasks(this.userId);
    // .subscribe((data: Task[]) => {
    //   console.log(data);
    //   // this.eventChanged.next(this.events.slice());
    //   // this.tasksObj = {
    //   //   _id: data._id,
    //   //   name: data.name,
    //   //   description: data.description,
    //   //   userId: data.userId
    //   // };
    //   this.tasksObj = data;
    //   console.log(this.tasksObj);
    // });

     console.log(this.userId);

   // this.tasks = this.taskService.getTasks();
    this.subscription = this.taskService.tasksChanged
      .subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
        }
      );
      this.tasks = this.taskService.getTasks();

      console.log(this.tasks);
  }

  onRemoveFromTaskList(task: Task, index) {
    task.userId = null;
    this.eventService.httpTaskToUser(null, null, task._id, false);
    this.taskService.deleteTasks(index);

  }
  onTaskComplete(task: Task, index) {
    this.eventService.httpTaskToUser(null,  null, task._id, true);
    this.taskService.deleteTasks(index);

  }
  onEditItem(index: number) {
    this.taskService.startedEditing.next(index);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
