export class Player{
    name: string;
    connected: boolean;
    connectionId: string;
    isCreator: boolean;

    profilePicture: number;
    emotion: number;

    answers: number[];

    constructor(obj: object){
        Object.assign(this ,obj);
    }

    get profilePictureSrc(){
        return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${this.profilePicture.toString().padStart(4, '0')}/${EMOTIONS[this.emotion]}.png`;
    }
}

const EMOTIONS = ['Normal'];