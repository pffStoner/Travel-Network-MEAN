export class Task {
    constructor(
        public name: string,
        public description?: string,
        public startDate?: string,
        public endtDate?: string,
        public taken?: boolean,
        public completed?: boolean,
        public _id?: string,
        public eventName?: string,
        public userId?: string) {

    }
}
