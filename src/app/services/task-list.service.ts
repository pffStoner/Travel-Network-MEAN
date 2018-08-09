import { Task } from '../models/task.model';
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Map } from '../models/map.model';
import { map } from 'rxjs/operators';


@Injectable()
export class TaskListService {
  startedEditing = new Subject<number>();
  tasksChanged = new Subject<Task[]>();
  private tasks: Task[] = [
    new Task('Vozene', '5 uni'),
    new Task('bileti', '3 mart' ),
  ];
  /**
   *
   */
  constructor(private http: HttpClient) {  }


  getTask(index: number) {
    return this.tasks[index];
  }

  getTasks() {
    return this.tasks.slice();
  }
  addTask(task: Task) {
    this.tasks.push(task);
    console.log(task);
    this.tasksChanged.next(this.tasks.slice());
  }

  addTasks(tasks: Task[]) {
    this.tasks.push(...tasks);
    this.tasksChanged.next(this.tasks.slice());
  }

  updateTask(index: number, newTask: Task) {
  this.tasks[index] = newTask;
  this.tasksChanged.next(this.tasks.slice());
  }

  deleteTasks(index: number) {
    this.tasks.splice(index, 1);
    this.tasksChanged.next(this.tasks.slice());
  }
  httpGetUserTasks(userId: string) {
     this.http
      .get<{ tasks: any }>('http://localhost:3000/api/events/tasks/' + userId)
      .pipe(map((taskInfo) => {
        return taskInfo.tasks.map(task => {
          console.log(task);
          return {
            _id: task._id,
            name: task.name,
            description: task.description,
            userId: task.userId,
            eventName: task.eventName,
           completed: task.completed

          };
        }
        );
      })) .subscribe((data: Task[]) => {
          console.log(data);
          // this.eventChanged.next(this.events.slice());
          console.log('dat', data);

         this.tasks = data;
         this.tasksChanged.next(this.tasks);
          console.log(this.tasks);
        });
      }
      httpTaskToUser(eventId: string, userId: string, taskId: string, taskComplete: boolean) {
      return  this.http
        .put('http://localhost:3000/api/events/task/' + eventId, {userId, taskId, taskComplete});
        // .subscribe(res => console.log(res));
      }
      httpTaskComplete( taskId: string) {
        return  this.http
          .put('http://localhost:3000/api/events/taskComplete/', taskId);
          // .subscribe(res => console.log(res));
        }

}
