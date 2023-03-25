export enum MUSIC_COMMANDS {
  play = 'play',
  pause = 'pause',
  next = 'next',
  previous = 'previous',
}

export const MUSIC_GRAMMAR =
  '#JSGF V1.0; grammar music commands; public <music commands> = play | pause | next | previour ;';
