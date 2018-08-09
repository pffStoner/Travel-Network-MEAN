import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Message } from '../models/message.model';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {

  messages = [new Message('this.message', 'mitko111')];
  connection;
  message;
  username;
  userId;
  userAuth = false;
  authListenerSubs: Subscription;
  userList;
  userListSubscribe: Subscription;
  mailbox;
  constructor(private chatService: ChatService,
  private authService: AuthService) {
  }

  ngOnInit() {
  //  this.onSendMail();
    this.chatService.httpGetEmails();
    this.chatService.mailsChanged.subscribe(mails => {
      this.mailbox = mails;
      console.log(mails);
    });
    this.mailbox = this.chatService.getMails();
    this.authService.userNameSubject.subscribe( username => {
      this.username = username;
      console.log(username);

    });
    this.userAuth = this.authService.getAuthStatus();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(
        {
          next: isAuth => {
            this.userAuth = isAuth;
          }
        }
      );
   this.username = this.authService.getUsername();
    console.log('username', this.username);
    this.userId = this.authService.getUserId();
    console.log('id', this.userId);

    // this.chatService.test(this.title);
    this.connection = this.chatService.getMessages2().subscribe((msg: Message) => {
      this.messages.push(msg);
      console.log('connect', msg);
    });

      this.authListenerSubs = this.chatService.onUpdateUserList().subscribe(users => {
        this.userList = users;
        console.log('userlist', this.userList);
      });
  }

  ngOnDestroy() {
    this.connection.unsubscire();
    this.userListSubscribe.unsubscribe();
  }
  onJoinGlobalRoom() {
    this.chatService.joinRoom(this.username, 'global');
    }
  onJoinRoom(input: HTMLInputElement) {
  console.log(input.value);
  this.chatService.joinRoom(this.username, input.value);
  }
  onLeaveRoom(input: HTMLInputElement) {
    // const filteredAry = this.userList.filter(e => e !== this.username);
  this.userList = [];
  this.messages = [];
    console.log(input.value);
    this.chatService.leaveRoom(this.username, input.value);
    this.chatService.leaveRoom(this.username, 'global');

    }

  sendMessage() {
    this.chatService.sendMessage(new Message(this.message, this.username));
    this.message = '';
    // console.log(this.message);
  }
  openNav(el: HTMLAnchorElement, el2: HTMLDivElement) {
    el.style.width = '50%';
    // el2.style.marginLeft = '500px';
    el2.style.visibility = 'hidden';
    console.log(el);
    console.log(el2);
    this.chatService.httpGetEmails();

    console.log('mailbox', this.mailbox.mailbox);
    console.log('username', this.username);

 }

  closeNav(el: HTMLAnchorElement, el2: HTMLDivElement) {
    console.log(el);

    el.style.width = '0';
    el2.style.marginLeft = '0';
    el2.style.visibility = 'visible';

 }
 onSendMail() {
   this.chatService.httpSendMail('5b5a13758bf57790c4b44946', 'mitko', '5b658af220d7f9b48cde0187', 'proba', 'dnes', 'daliii');
 }
}




