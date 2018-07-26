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

const appRoutes: Routes = [
    { path: '', redirectTo: '/events', pathMatch: 'full'},
    { path: 'events', component: EventsComponent, children: [
        {path: '', component: EventStartComponent },
        {path: 'new', component: EventEditComponent },
        {path: ':id', component: EventDetailComponent},
        {path: ':id/edit', component: EventEditComponent},
        {path: ':id/gallery', component: EventGalleryComponent}

    ] },
    { path: 'tasks', component: TaskListComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule {

}



