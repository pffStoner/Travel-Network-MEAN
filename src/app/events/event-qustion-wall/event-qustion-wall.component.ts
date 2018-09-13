import { QuestionWall } from '../../models/questionWall.model';

import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Location } from '@angular/common';
import { ChatService } from '../../services/chat.service';


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
    private chat: ChatService,
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
    this.chat.onAddQuestion().subscribe((data: QuestionWall[]) => {
      this.questionWall = data;
      console.log(data);

    });
    this.chat.onAddAnswer().subscribe((data: any) => {
      console.log('answer', data.answer);
      this.questionWall.forEach(element => {
        if (element._id === data.questionId) {
          element.answers.push(data.answer.answer);
        }
      });
    });

  }

  onAddQuestion(input: HTMLInputElement) {
    this.eventService.httpAskQuestion(this.id, this.username, input.value, this.userId)
      .subscribe(data => {
        this.chat.addQuestion(this.id);
        console.log(data);
      });
    // this.questionWall = this.eventService.getQaWall();
  }
  onAnswerQuestion(questionId: string, input: HTMLInputElement) {
    this.eventService.httpAnswerQuestion(this.id, this.username,
      questionId, input.value, this.userId)
      .subscribe(data => {
        this.chat.addAnswer(this.id, questionId, data);

        // this.qaWall.push(data.answer);
        // if (this.qaWall.answers) {
        // }
        // this.questionWall.forEach(element => {
        //     if (element._id === questionId) {
        //       element.answers.push(data.answer);
        //       console.log(element.answers);
        //   }
        // });
        console.log('qid', this.questionWall);
        //   this.chat.addQuestion(this.id);
      });

  }
  backClicked() {
    this._location.back();
  }

}
