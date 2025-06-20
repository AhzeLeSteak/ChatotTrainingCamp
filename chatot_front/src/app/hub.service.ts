import {inject, Injectable, signal} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {BehaviorSubject, filter, map, Observable, shareReplay, tap} from 'rxjs';
import { Room } from '../models/room';
import { RoomParams } from '../models/room-params';
import {Router} from '@angular/router';


export const PLAYER_NAME = 'player_name';
const ROOM_CODE = 'room_code';


@Injectable({
  providedIn: 'root'
})
export class HubService {

  private router = inject(Router);

  private hub: signalR.HubConnection;

  private _connected = signal(false);
  private _inRoom = signal(false);
  private _room$: Observable<Room>;
  private _onNewQuestion$: Observable<void>

  constructor() {
    const url = window.location.hostname === 'localhost'
      ? "http://localhost:5237/room"
      : window.location.origin + '/api/room';
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .build();
  }

  public async createConnection(){
    await this.hub.start();
    this._connected.set(true);
    console.log("Connection started");
    this.hub.onclose(() => this._connected.set(false));
  }

  private subscribeUpdate(playerName: string, roomObject: object){
    this._inRoom.set(true);
    localStorage.setItem(PLAYER_NAME, playerName);

    this._room$ = new Observable<object>(observer => {
      observer.next(roomObject);
      this.hub.on('UpdateRoom', (roomObject: object) => observer.next(roomObject));
    }).pipe(
      map((roomObject) => new Room(roomObject, this.hub.connectionId!)),
      tap(room => console.log('Update room', room)),
      tap(room => localStorage.setItem(ROOM_CODE, room.code)),
      shareReplay({refCount: true})
    );

    let questionId = -1;
    this._onNewQuestion$ = this._room$.pipe(
      filter(room => {
        let res= false;
        if(room.questionIndex === questionId + 1)
          res = true;
        questionId = room.questionIndex;
        return res;
      }),
      map(() => void 0)
    )
  }

  public async createRoom(playerName: string){
    const room = await this.hub.invoke<object>('CreateRoom', playerName);
    if(!room) return false;
    this.subscribeUpdate(playerName, room);
    return true;
  }

  public async joinRoom(roomCode: string, playerName: string, rejoin = false): Promise<boolean>{
    const room = await this.hub.invoke<object | null>('JoinRoom', roomCode, playerName, rejoin);
    if(room === null) {
      localStorage.removeItem(ROOM_CODE);
      return false;
    }
    this.subscribeUpdate(playerName, room);
    return true;
  }

  public async quitRoom(){
    await this.hub.invoke('Quit');
    this._room$ = undefined!;
    this._inRoom.set(false);
    return this.router.navigate(['']);
  }

  public sendMessage(content: string){
    return this.hub.invoke<void>('SendMessage', content);
  }

  async tryRejoin() {
    const roomCode = localStorage.getItem(ROOM_CODE);
    const playerName = localStorage.getItem(PLAYER_NAME);
    if(!roomCode || !playerName) return false;
    return this.joinRoom(roomCode, playerName, true);
  }

  public async changePP(index: number){
    return this.hub.invoke('ChangePP', index);
  }


  updateParams(params: RoomParams) {
    return this.hub.invoke('UpdateParam', params)
  }

  ready(){
    return this.hub.invoke('Ready');
  }
  startRoom(){
    return this.hub.invoke('StartRoom');
  }

  replay(){
    return this.hub.invoke('Replay');
  }

  async answer(pkid: number, milliseconds: number){
    this.hub.invoke('Answer', pkid, milliseconds);
  }


  public nextQuestion(){
    this.hub.invoke('NextQuestion');
  }


  get room$(){
    return this._room$;
  }

  get onNewQuestion$(){
    return this._onNewQuestion$;
  }

  public get connected(){
    return this._connected.asReadonly();
  }

  public get inRoom(){
    return this._inRoom();
  }

}
