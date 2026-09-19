export enum GameMode{
  Cry,
  Silhouette
}

export interface RoomParams{
    nbRounds: number;
    generations: number[];
    roundDurationSeconds: number;
    gameMode: GameMode;
}
