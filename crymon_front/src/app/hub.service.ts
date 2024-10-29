import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/room';
import { RoomParams } from '../models/room-params';


export const PLAYER_NAME = 'player_name';
const ROOM_CODE = 'room_code';



@Injectable({
  providedIn: 'root'
})
export class HubService {
  
  private hub: signalR.HubConnection;

  private _connected = false;
  private _inRoom = false;
  private readonly roomSubject = new BehaviorSubject<Room>(null!);
  
  constructor() {
    this.hub = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5237/room")
    .build();
  }
  
  public async createConnection(){
    await this.hub.start();
    this._connected = true;
    console.log("Connection started");
    this.hub.onclose(() => this._connected = false);
  }

  private processRoomFromHub(roomObject: object){
    const room = new Room(roomObject, this.hub.connectionId!);
    localStorage.setItem(ROOM_CODE, room.code);
    console.log('UpdateRoom', room);
    this.roomSubject.next(room);
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
    this.sendMessage(`${playerName} joined the room`);
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
    if(!rejoin)
      this.sendMessage(`${playerName} joined the room`);
    return true;
  }

  public async sendMessage(content: string){
    this.hub.invoke('SendMessage', content);
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

  async answer(pkid: number){
    this.hub.invoke('Answer', pkid);
  }

  
  public nextQuestion(){
    this.hub.invoke('NextQuestion');
  }


  get $room(){
    return this.roomSubject.asObservable();
  }

  public get connected(){
    return this._connected;
  }

  public get inRoom(){
    return this._inRoom;
  }
  
}
