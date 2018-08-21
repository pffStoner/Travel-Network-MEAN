import { QuestionWall } from '../../models/questionWall.model';

import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import {Location} from '@angular/common';


@Component({
  selector: 'app-event-qustion-wall',
  templateUrl: './event-qustion-wall.component.html',
  styleUrls: ['./event-qustion-wall.component.css']
})
export class EventQustionWallComponent implements OnInit {
  questionWall: QuestionWall[];
  subscribtion = new Subscription;
  id;
  userId;
  username;

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private _location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe(
        (paramMap: ParamMap) => {
          if (paramMap.has('id')) {
            this.id = paramMap.get('id');
            console.log('id', this.id);

          }
        });
    this.authService.userNameSubject.subscribe(username => {
      this.username = username;
      console.log(username);
    });
    this.username = this.authService.getUsername();
    this.userId = this.authService.getUserId();


    // this.eventService.httpAskQuestion('5b642f7f3691966d441e1ac1', 'az', 'kogaaaa');
    this.eventService.httpGetQustionWall(this.id);
    this.questionWall = this.eventService.getQaWall();
    this.eventService.qaWallChanged.subscribe((wall: QuestionWall[]) => {
      this.questionWall = wall;
      console.log('WaLL 2', this.questionWall);

    });
    console.log('WaLL 2', this.questionWall);
    console.log('id', this.id);

  }

  onAddQuestion(input: HTMLInputElement) {
    this.eventService.httpAskQuestion(this.id, this.username, input.value, this.userId);
    // this.questionWall = this.eventService.getQaWall();
  }
  onAnswerQuestion(questionId: string, input: HTMLInputElement) {
    this.eventService.httpAnswerQuestion(this.id, this.username, questionId, input.value, this.userId);
    console.log('qid', questionId);
    console.log('qid', input.value);
  }
  backClicked() {
    this._location.back();
  }

}
