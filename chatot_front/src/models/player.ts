export class Player{
  name: string;
  connected: boolean;
  connectionId: string;
  isCreator: boolean;
  points: number;
  answers: {pkId: number, timeInMs:number}[];

  profilePicture: number;
  emotion: number;

  constructor(obj: object){
    Object.assign(this ,obj);
  }

  public profilePictureSrcWithEmotion(emotion: string){
    return `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/portrait/${this.profilePicture.toString().padStart(4, '0')}/${emotion}.png`;
  }

  get profilePictureSrc(){
    return this.profilePictureSrcWithEmotion(!this.connected ? Emotion.Dizzy : EMOTIONS[this.emotion]);
  }
}

export enum Emotion
{
  Joyous = 'Joyous',
  Happy = 'Happy',
  Inspired = 'Inspired',
  Normal = 'Normal',
  Determined = 'Determined',
  Sigh = 'Sigh',
  Worried = 'Worried',
  Pain = 'Pain',
  Sad = 'Sad',
  Shouting = 'Shouting',
  Stunned = 'Stunned',
  Dizzy = 'Dizzy',
  Surprised = 'Surprised',
  Angry = 'Angry',
  TearyEyed = 'Teary-Eyed',
  Crying = 'Crying',
}

export const EMOTIONS = Object.keys(Emotion)
  .filter(key => isNaN(Number(key)))
  //@ts-ignore
  .map((key) => Emotion[key]);
