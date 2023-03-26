export enum MUSIC_PLAYING {
  Start = 'START',
  Pause = 'PAUSE',
  Stop = 'STOP',
}

export const educateMessage = 'Use the following signs to control the music.';

export const MUSIC_CONTROL_ACTIONS = [
  'Use open palm to pause.',
  'Use victory singnal to play.',
  'Use thumbs up to go to previous track.',
  'Use closed fist to go to next track.',
  'Point up with index finger to increase volume.',
  'Use thumbs down to reduce the volume',
  //   'Hold the sign for at least 2 seconds after the first sign is successfully recognized.',
];

export const ExcludeMusic = ['birthday', 'christmas', 'new year'];
