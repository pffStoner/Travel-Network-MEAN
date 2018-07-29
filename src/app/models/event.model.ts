import { Task } from './task.model';
import { Gallery } from 'src/app/models/gallery.model';

export class Event {
    constructor(public id: string,
        public name: string,
        public description: string,
        public img: string,
        public tasks: Task[],
        public createdBy: string,
        gallery?: Gallery[],
        public startDate?: string,
        public endDate?: string
   ) {

    }
}
