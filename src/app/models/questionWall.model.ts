export class QuestionWall {
    constructor(
        public _id: string,
        public username: string,
        public question: string,
        public answers: [{
             _id: string,
             username: string,
             answer: string
        }]
        ) {

    }
}
