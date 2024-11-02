export class Question{
    propositions: number[];
    answer: number;
    startDate: Date;

    constructor(obj: object){
        Object.assign(this, obj);
        this.startDate = new Date(this.startDate);
    }
}