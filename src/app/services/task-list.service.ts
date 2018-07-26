import { Task } from '../models/task.model';
import { Subject } from 'rxjs';

export class TaskListService {
  startedEditing = new Subject<number>();
  tasksChanged = new Subject<Task[]>();

  private tasks: Task[] = [
    new Task('Vozene', '5 uni'),
    new Task('bileti', '3 mart' ),
  ];

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
}
