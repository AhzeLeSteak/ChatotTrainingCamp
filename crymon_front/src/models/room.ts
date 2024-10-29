import { Message } from "./message";
import { Player } from "./player";
import { Question } from "./question";
import { RoomParams } from "./room-params";

export class Room {
    code: string;
    status: RoomStatus;
    players: Player[];
    messages: Message[];
    params: RoomParams;

    questions: Question[];
    questionIndex: number;

    readonly currentPlayer: Player;

    constructor(obj: object, currentPlayerConnectionId: string){
        Object.assign(this, obj);
        this.players = (this.players ?? []).map(p => new Player(p));
        this.questions = (this.questions ?? []).map(q => new Question(q))
        this.currentPlayer = this.players.find(p => p.connectionId === currentPlayerConnectionId)!;
    }

    get inLobby(){
        return this.status === RoomStatus.Waiting;
    }

    get IsPlaying(){
        return this.status === RoomStatus.Playing;
    }

    get isBeetweenRound(){
        return this.status === RoomStatus.BetweenRounds;
    }

    get currentQuestion(){
        return this.questions[this.questionIndex];
    }
}

export enum RoomStatus{
    Waiting,
    Playing,
    BetweenRounds
}