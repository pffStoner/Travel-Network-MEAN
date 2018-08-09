import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsComponent } from './events/events.component';
import { EventStartComponent } from './events/event-start/event-start.component';
import { EventEditComponent } from './events/event-edit/event-edit.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { TaskListComponent } from './task-list/task-list.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EventGalleryComponent } from './events/event-gallery/event-gallery.component';
import { AuthGuard } from './auth/auth.guard';
import { MapComponent } from './events/map/map.component';
import { ChatComponent } from './chat/chat.component';
import { EventQustionWallComponent } from './events/event-qustion-wall/event-qustion-wall.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/events', pathMatch: 'full'},
    { path: 'events', component: EventsComponent, children: [
        {path: '', component: EventStartComponent },
        {path: 'new', component: EventEditComponent, canActivate: [AuthGuard] },
        {path: ':id', component: EventDetailComponent},
        {path: ':id/edit', component: EventEditComponent, canActivate: [AuthGuard]},
        {path: ':id/gallery', component: EventGalleryComponent},
        {path: ':id/map', component: MapComponent},
        {path: ':id/questions', component: EventQustionWallComponent},

        // {path: ':id/chat', component: ChatComponent}
    ] },
    { path: 'tasks', component: TaskListComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'chat', component: ChatComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {

}



