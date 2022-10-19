export enum CardStates {
  DEFAULT = 'default',
  FLIPPED = 'flipped',
}
export interface CardState {
  state: CardStates;
}
