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

    questionIndex: number;
    currentQuestion: Question;

    readonly currentPlayer: Player;

    constructor(obj: object, currentPlayerConnectionId: string){
        Object.assign(this, obj);
        this.players = (this.players ?? []).map(p => new Player(p));
        this.currentQuestion = this.currentQuestion ? new Question(this.currentQuestion) : null!;
        this.currentPlayer = this.players.find(p => p.connectionId === currentPlayerConnectionId)!;
    }

    get inLobby(){
        return this.status === RoomStatus.Lobby;
    }

    get IsPlaying(){
        return this.status === RoomStatus.Playing;
    }

    get isInAnswers(){
      return this.status === RoomStatus.Answers;
    }

    get isInTimer(){
        return this.status === RoomStatus.Timer;
    }

    get isInScores(){
        return this.status === RoomStatus.Scores;
    }

    get url(){
      return `${window.location.origin}/join/${this.code}`
    }
}

export enum RoomStatus{
  Lobby,
  Playing,
  Answers,
  Timer,
  Scores,
}
