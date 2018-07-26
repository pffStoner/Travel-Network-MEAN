import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { TaskListService } from '../../services/task-list.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit, OnDestroy {
  @ViewChild('form') tlForm: NgForm;
  editedItemIndex: number;
  editedItem: Task;
  editMode = false;
  subscribe: Subscription;

  constructor(private tsService: TaskListService) { }

  ngOnInit() {
   this.subscribe = this.tsService.startedEditing
      .subscribe(
        (index: number) => {
          this.editedItemIndex = index;
          this.editMode = true;
          this.editedItem = this.tsService.getTask(index);
          this.tlForm.setValue({
              name: this.editedItem.name,
              description: this.editedItem.description
          });
        }
      );
  }

  onSubmit(form: NgForm) {
   const value = form.value;
    const newTask = new Task(value.name, value.description);
    if (this.editMode) {
      this.tsService.updateTask(this.editedItemIndex, newTask);
    } else {
      this.tsService.addTask(newTask);
    }
    this.editMode = false;
    form.reset();
  }
  onClear() {
    this.editMode = false;
    this.tlForm.reset();
  }
  onDelete() {
    this.tsService.deleteTasks(this.editedItemIndex);
    this.onClear();
  }
  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

}
