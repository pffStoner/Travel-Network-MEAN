import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Form, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
// import { start } from 'repl';
import {GoogleAPIService} from '../../services/google-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  subscribtion = new Subscription;
  id;
  eId;
  editMode = false;
  try;
  // na tazi promenliva prisovqvame formata ot .html
  eventForm: FormGroup;
  constructor(private route: ActivatedRoute,
  private eService: EventService,
   private router: Router,
  private gApiService: GoogleAPIService) { }

  ngOnInit() {

    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
    //  this.gApiService.httpGetEvents();
    console.log('try' + this.try);

  }
  onAddingTask() {
  (<FormArray> this.eventForm.get('tasks')).push(
    new FormGroup({
      'name': new FormControl(null, Validators.required),
      'description': new FormControl(null, Validators.required  ),
    })
  );
  }

  private initForm() {
  let eventName = '';
  let eventImgPath = '';
  let description = '';
  let startDate = '';
  let endDate = '';
  // tslint:disable-next-line:prefer-const
  let eventTasks = new FormArray([]);

  if (this.editMode) {
    const event = this.eService.getEvent(this.id);
    this.eId = event.id,
    eventName = event.name;
    eventImgPath = event.img;
    description = event.description;
    startDate = event.startDate;
    endDate = event.endDate;

    // proverqvame dali imame nqkakva zadachi
    if (event['task']) {
        // tslint:disable-next-line:prefer-const
        for (let task of event.task) {
            eventTasks.push(
              new FormGroup({
                'name': new FormControl(task.name, Validators.required),
                'description': new FormControl(task.description, Validators.required),
              })
            );
        }
    }
  }
  // prisvoqvame poletata ot .html
  this.eventForm = new FormGroup({
    // trqbva da suvpadat s formControlName v .html
    'name': new FormControl(eventName, Validators.required),
    'imgUrl': new FormControl(eventImgPath, Validators.required),
    'description': new FormControl(description, Validators.required),
    'startDate' : new FormControl(startDate),
    'endDate' : new FormControl(endDate),
    'tasks': eventTasks
  });
  }
  onSubmit() {
    const newEvent = new Event(
      null,
      this.eventForm.value['name'],
       this.eventForm.value['description'],
       this.eventForm.value['imgUrl'],
       this.eventForm.value['tasks'],
       this.eventForm.value['startDate'],
       this.eventForm.value['endDate']
      );

    if (this.editMode) {
      // moje da izpolzvame this.eventForm.value, to shte
      // ni vurne dannite vmesto da pravim newEvent(ako sme gi podredili kakto trqbva  )
      this.eService.httpUpdateEvent(this.eId, newEvent);
    //  this.eService.updateEvent(this.id, newEvent);
    } else {
    //  this.eService.addEvent(newEvent);
        this.eService.httpAddEvent(newEvent);
    }
    console.log(this.eventForm);
    this.onCancel();
  }
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route});
    console.log(this.eId);
  }
  // v .html imame formArrayName="tasks", koito dostupvane i moje da iztriem opredelen el po index
  onDeleteTask(index: number) {
    (<FormArray>this.eventForm.get('tasks')).removeAt(index);
  }

  getControls() {
    return (<FormArray>this.eventForm.get('tasks')).controls;
  }
}
