export class Message {
  playerName: string;
  content: string;
  fromServer: boolean;
  color: number;

  constructor(obj: object){
    Object.assign(this, obj);
  }

  get chatColor() {
    return [
      'greyish',
      'blue',
      'green',
      'yellow',
      'red'
    ][this.color];
  }
}


