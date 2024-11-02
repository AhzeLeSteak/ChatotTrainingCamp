export class Player{
    name: string;
    connected: boolean;
    connectionId: string;
    isCreator: boolean;
    points: number;

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
    Angry = 'Angry',
    Crying = 'Crying',
    Determined = 'Determined',
    Dizzy = 'Dizzy',
    Happy = 'Happy',
    Inspired = 'Inspired',
    Joyous = 'Joyous',
    Normal = 'Normal',
    Pain = 'Pain',
    Sad = 'Sad',
    Shouting = 'Shouting',
    Sigh = 'Sigh',
    Stunned = 'Stunned',
    Surprised = 'Surprised',
    TearyEyed = 'Teary-Eyed',
    Worried = 'Worried'
}

export const EMOTIONS = Object.keys(Emotion)
    .filter(key => isNaN(Number(key)))