import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { ActivatedRoute, Router, Params, ParamMap} from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  // selectedEvent: Event;
  id;
  navLinks = [
   {path: this.id , label: 'Details'},
   {path: this.id + '/map', label: 'Map'},
  ];

  constructor(private router: Router,
    private location: Location,
    private route: ActivatedRoute,
  private eventService: EventService ) {

  }

  ngOnInit() {
    this.route.paramMap
    .subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('id')) {
          this.id = paramMap.get('id');
          console.log('id', this.id);

        }
        });
        console.log('id', this.id);

    // this.eventService.editId.subscribe(id => {
    //   this.id = id;
    //   console.log('ID', this.id);
  //   this.route.firstChild.paramMap.subscribe(
  //     ( params: ParamMap ): void => {

  //         this.id = params.get('id');
  //         console.log('ID', this.id);

  //     }
  // );

  // this.route.firstChild.params.subscribe(params => {
  //   console.log('ID', this.id);
  //    this.id = params['id'];
  // });
  // this.id = this.route.children[0].children[1].params['id'];
   // this.id = this.eventService.eventId;
  }
//   toEvent() {
//     this.location.back(); // <-- go back to previous location on cancel
// //  }
// toMap() {
//   this.eventService.editId.next(this.id);
//   this.router.navigate(['map'], { relativeTo: this.route });
// }

toMap() {
  this.router.navigate(['map'], { relativeTo: this.route });
  alert('dsd');
}
}
