import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task } from '../models/task.model';
import { TaskListService } from '../services/task-list.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[];
  private subscription: Subscription;

  constructor(private taskService: TaskListService) {
   }

   ngOnInit() {
    this.tasks = this.taskService.getTasks();
    this.subscription = this.taskService.tasksChanged
      .subscribe(
        (tasks: Task[]) => {
          this.tasks = tasks;
        }
      );
  }
  onEditItem(index: number) {
    this.taskService.startedEditing.next(index);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
