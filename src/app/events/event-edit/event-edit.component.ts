import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, ParamMap } from '@angular/router';
import { Form, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { EventService } from '../../services/event.service';
import { Event } from '../../models/event.model';
// import { start } from 'repl';
import { GoogleAPIService } from '../../services/google-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {
  subscribtion = new Subscription;
  id;
  createdBy: string;
  eId;
  editMode = false;
  index;
  event: Event;
  mode = 'create';
  // na tazi promenliva prisovqvame formata ot .html
  eventForm: FormGroup;
  constructor(private route: ActivatedRoute,
    private eService: EventService,
    private router: Router,
    private gApiService: GoogleAPIService,
    private eventService: EventService) { }

  ngOnInit() {
    const eventTasks = new FormArray([]);


    this.eventForm = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required] }),
      imgUrl: new FormControl(null, { validators: [Validators.required] }),
      description: new FormControl(null, { validators: [Validators.required] }),
      startDate: new FormControl(null),
      endDate: new FormControl(null),
      tasks: eventTasks
    });




    this.route.paramMap
      .subscribe(
        (paramMap: ParamMap) => {
          if (paramMap.has('id')) {
            this.mode = 'edit';
            this.editMode = true;
            this.id = paramMap.get('id');
            this.eventService.getEvent(this.id)
              .subscribe(eventData => {

                 this.event = {
                  id: eventData._id,
                  name: eventData.name,
                  description: eventData.description,
                  img: eventData.img,
                  tasks: eventData.tasks,
                  createdBy: eventData.createdBy,
                  map: eventData.map,
                  startDate : eventData.startDate,
                  endDate : eventData.endDate,
                  gallery: eventData.gallery
                };
                // proverqvame dali imame nqkakva zadachi
                if (this.event['tasks']) {
                  // tslint:disable-next-line:prefer-const
                  for (let task of this.event.tasks) {
                    eventTasks.push(
                      new FormGroup({
                        'name': new FormControl(task.name, Validators.required),
                        'description': new FormControl(task.description),
                        userId: new FormControl(task.userId)
                      })
                    );
                  }
                }
                this.eventForm.setValue({
                  name: this.event.name,
                  description: this.event.description,
                  imgUrl: this.event.img,
                  startDate: this.event.startDate,
                  endDate: this.event.endDate,
                  tasks: eventTasks
                  });

              });

          } else {
            this.mode = 'create';
            this.editMode = false;
            this.id = null;
          }

        }
      );
    console.log(this.id);
    console.log(this.event);
  }
  onSubmit() {
    const newEvent = new Event(
      null,
      this.eventForm.value['name'],
      this.eventForm.value['description'],
      this.eventForm.value['imgUrl'],
      this.eventForm.value['tasks'],
      null,
      null,
      null,
      this.eventForm.value['startDate'],
      this.eventForm.value['endDate']
    );

    if (this.editMode) {
      // moje da izpolzvame this.eventForm.value, to shte
      // ni vurne dannite vmesto da pravim newEvent(ako sme gi podredili kakto trqbva  )
      this.eService.httpUpdateEvent(this.id, newEvent);
      //  this.eService.updateEvent(this.id, newEvent);
    } else {
      this.eService.httpAddEvent(newEvent);
      console.log('new event', newEvent);
    }
    console.log(this.eventForm);
    this.onCancel();
  }

  onAddingTask() {
    (<FormArray>this.eventForm.get('tasks')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'description': new FormControl(null, Validators.required),
      })
    );
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
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
////
