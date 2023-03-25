export const CapricePrompts = {
  greetings: "Hi, I'm Caprice. The Fun AI. I like spreading smiles.",
  askName: 'May i please know yor name.',
  howAreYou: 'How are you doing today?',
};

// Since NER models were performing very badly
// This is a temp solution, Although they perform better for non indian names
export const NameResponseTemplate = [
  'my name is',
  'my name',
  'name is',
  'yes',
  'sure',
  'yeah',
];

export enum SPEECH_RECOGNITION_INTENT {
  Joke,
  Meme,
  Music,
  Art,
}

export const VIDEO_EMOTIONS = [
  'angry',
  'disgusted',
  'fearful',
  'happy',
  'neutral',
  'sad',
  'surprised',
];
export const TEXT_EMOTIONS = [
  'love',
  'admiration',
  'joy',
  'approval',
  'caring',
  'excitement',
  'amusement',
  'gratitude',
  'desire',
  'anger',
  'optimism',
  'disapproval',
  'grief',
  'annoyance',
  'pride',
  'curiosity',
  'neutral',
  'disgust',
  'disappointment',
  'realization',
  'fear',
  'relief',
  'confusion',
  'remorse',
  'embarrassment',
  'surprise',
  'sadness',
  'nervousness',
];

export enum GESTURE_TYPES {
  None = 'None',
  Closed_Fist = 'Closed_Fist',
  Open_Palm = 'Open_Palm',
  Pointing_Up = 'Pointing_Up',
  Thumb_Down = 'Thumb_Down',
  Thumb_Up = 'Thumb_Up',
  Victory = 'Victory',
  ILoveYou = 'ILoveYou',
}

export function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}
