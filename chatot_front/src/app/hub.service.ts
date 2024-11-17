import {inject, Injectable} from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject, Observable } from 'rxjs';
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

  private _connected = false;
  private _inRoom = false;
  private readonly roomSubject = new BehaviorSubject<Room>(null!);
  private readonly _onNewQuestion = new BehaviorSubject<never>(null!);

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
    this._connected = true;
    console.log("Connection started");
    this.hub.onclose(() => this._connected = false);
  }

  private processRoomFromHub(roomObject: object){
    let oldQuestionId = -1;
    if(this.roomSubject.value)
      oldQuestionId = this.roomSubject.value.questionIndex;
    const room = new Room(roomObject, this.hub.connectionId!);
    localStorage.setItem(ROOM_CODE, room.code);
    console.log('UpdateRoom', room);
    this.roomSubject.next(room);
    if(room.questionIndex === oldQuestionId + 1)
      this._onNewQuestion.next(null!);
  }

  private subscribeUpdate(){
    this.hub.on('UpdateRoom', (roomObject: object) => this.processRoomFromHub(roomObject));
  }

  public async createRoom(playerName: string){
    const room = await this.hub.invoke<object>('CreateRoom', playerName);
    if(!room) return false;
    this._inRoom = true;
    this.processRoomFromHub(room);
    localStorage.setItem(PLAYER_NAME, playerName);
    this.subscribeUpdate();
    return true;
  }

  public async joinRoom(roomCode: string, playerName: string, rejoin = false): Promise<boolean>{
    const room = await this.hub.invoke<object | null>('JoinRoom', roomCode, playerName, rejoin);
    if(room === null) {
      localStorage.removeItem(ROOM_CODE);
      return false;
    }
    this._inRoom = true;
    localStorage.setItem(PLAYER_NAME, playerName);
    this.subscribeUpdate();
    this.processRoomFromHub(room);
    return true;
  }

  public async quitRoom(){
    await this.hub.invoke('Quit');
    this._inRoom = false;
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


  get $room(){
    return this.roomSubject.asObservable();
  }

  get $onNewQuestion(){
    return this._onNewQuestion.asObservable();
  }

  public get connected(){
    return this._connected;
  }

  public get inRoom(){
    return this._inRoom;
  }

}
