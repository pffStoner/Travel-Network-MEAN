import { Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import * as io from 'socket.io-client';
import { Subject, Observable, Observer } from 'rxjs';
import { Message } from '../models/message.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class ChatService {

    private url = 'http://localhost:3000/';
    private socket;
    msg: Message;
    userList = new Subject();
    mailsChanged = new Subject();
    mails;

    encapsulation: ViewEncapsulation.None;
    constructor(  private http: HttpClient) { }
getMails() {
    return this.mails;
}

    joinRoom(username, room) {
        // this.socket = io(this.url);

        const params = {
            name: username,
            room: room
        };
        this.socket.emit('join', params, function (err) {
            if (err) {
                // TODO
                console.log(err);
            } else {
                console.log('No error');

            }
        });
    }

    leaveRoom(username, room) {
        // this.socket = io(this.url);

        const params = {
            name: username,
            room: room
        };
        this.socket.emit('leave', room, function (err) {
            if (err) {
                // TODO
                console.log(err);
            } else {
                console.log('No error');

            }
        });
    }



    sendMessage(message) {
        // this.socket.emit('add-message', message);
        this.socket.emit('createMessageA', message);

    }

    getMessages() {
        const observable = new Observable((observer: Observer<string>) => {
            this.socket = io(this.url);

            this.socket.on('message', (data) => {
                observer.next(data);
            });

            return () => {
                this.socket.disconect();
            };

        });

        return observable;
    }

    getMessages2() {
              this.socket = io(this.url);

        const observable = new Observable((observer: Observer<Message>) => {

            this.socket.on('newMessage', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }

    onUpdateUserList() {
        //     this.socket.on('updatedList', function (users) {

        // this.userList.next(users);
        //     }); //

        const observable = new Observable((observer: Observer<{}>) => {
            // this.socket = io(this.url);

            this.socket.on('updatedList', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }


    onUpdateRoomsList() {

        const observable = new Observable((observer: Observer<{}>) => {
            // this.socket = io(this.url);

            this.socket.on('rooms', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }
    onAddQuestion() {

        const observable = new Observable((observer: Observer<{}>) => {
            // this.socket = io(this.url);

            this.socket.on('question', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }
     addQuestion(eventId: string) {
        // this.socket.emit('add-message', message);
        this.socket.emit('add-question', eventId);
    }

    onAddAnswer() {

        const observable = new Observable((observer: Observer<{}>) => {
            // this.socket = io(this.url);

            this.socket.on('answer', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }
    addAnswer(eventId: string, questionId, answer) {
        // this.socket.emit('add-message', message);
        const data = {
            eventId: eventId,
            questionId: questionId,
            answer: answer
        };
        this.socket.emit('add_answer', data);
    }
    onChangeTaskStatus() {
        const observable = new Observable((observer: Observer<{}>) => {
            // this.socket = io(this.url);

            this.socket.on('status', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconect();
            };

        });
        return observable;
    }

    changeStatus(eventId: string, userId: string, taskId: string, taskComplete: boolean ) {
        // this.socket.emit('add-message', message);
        const data = {
            eventId: eventId,
            userId: userId,
            taskId: taskId,
            taskComplete: taskComplete
        };
        this.socket.emit('change_status', data);
    }









//     httpSendMail(recieveUserId: string, sendUsername: string, sendUserId: string,
//     title, date, content) {
//         this.http
//         .put('http://localhost:3000/api/user/sendEmail/', {recieveUserId,
//          sendUsername,
//          sendUserId,
//         title,
//     date,
// content})
//         .subscribe(res => console.log(res));
//       }

//       httpGetEmails() {
//         this.http
//           .get<{ mails: any }>(' http://localhost:3000/api/users')
//             // .pipe(map((maildata) => {
//             //   return maildata.mails.map(mail => {
//             //     console.log(mail);
//             //     return {
//             //       id: mail._id,
//             //       title: mail.title,
//             //       date: mail.date,
//             //       content: mail.content,
//             //       author: mail.username
//             //     };
//             //   }
//             //   );
//             // }))
//           .subscribe((data) => {
//             this.mails = data;
//             console.log('mails', this.mails);
//             this.mailsChanged.next(this.mails);
//           });
//       }

}
