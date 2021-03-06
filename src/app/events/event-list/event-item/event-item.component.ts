import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../../../models/event.model';

@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.css']
})
export class EventItemComponent implements OnInit {

  @Input() event: Event;
  @Input() index;

/**
 *
 */
constructor() {}

  ngOnInit() {
    this.event.slots = this.event.slots - this.event.members.length;
  }



}
