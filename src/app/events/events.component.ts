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
  // navLinks = [
  //  {path: this.id , label: 'Details'},
  //  {path: this.id + '/map', label: 'Map'},
  // ];

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
      }

toMap() {
  this.router.navigate(['map'], { relativeTo: this.route });
  alert('dsd');
}
}
