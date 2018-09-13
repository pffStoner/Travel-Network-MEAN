 import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction';   // agm-direction

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TaskListComponent } from './task-list/task-list.component';
import { HeaderComponent } from './header/header.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { AppRoutingModule } from './app-routing.module';
import { EventsComponent } from './events/events.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventItemComponent } from './events/event-list/event-item/event-item.component';
import { TaskEditComponent } from './task-list/task-edit/task-edit.component';
import { TaskListService } from './services/task-list.service';
import { EventStartComponent } from './events/event-start/event-start.component';
import { EventEditComponent } from './events/event-edit/event-edit.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventQustionWallComponent } from './events/event-qustion-wall/event-qustion-wall.component';

import { EventService } from './services/event.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventGalleryComponent } from './events/event-gallery/event-gallery.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MapComponent } from './events/map/map.component';
import { ChatComponent } from './chat/chat.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// material design
import {MatTabsModule} from '@angular/material/tabs';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule,
  MatCheckboxModule,
  MatRadioModule,
MatError} from '@angular/material';
import { ErrorInterceptor } from './error.inceptor';
import { ErrorComponent } from './error/error.component';


@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    HeaderComponent,
    DropdownDirective,
    EventStartComponent,
    EventsComponent,
    EventDetailComponent,
    EventItemComponent,
    TaskEditComponent,
    EventEditComponent,
    EventListComponent,
    LoginComponent,
    RegisterComponent,
    EventGalleryComponent,
    MapComponent,
    ChatComponent,
    EventQustionWallComponent,
    ErrorComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    AgmDirectionModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyACVpx3MwofDbNXyhnMfVlE1VmjEdo4kJ8',
      libraries: ['places']
    }),
    BrowserAnimationsModule,
    MatTabsModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule
  ],
  providers: [TaskListService,
   EventService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
