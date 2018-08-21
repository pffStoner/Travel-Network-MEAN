import { Task } from './task.model';
import { Gallery } from 'src/app/models/gallery.model';
import { Map } from './map.model';

export class Event {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public img: string,
        public tasks: Task[],
        public createdBy: string,
        public map: Map,
        public gallery?: Gallery[],
        public startDate?: string,
        public endDate?: string,
        public slots?: number,
        public members?

   ) {

    }
}
