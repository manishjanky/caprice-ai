import { MediaPermissionState } from './../utils/media.utils';
import { EventEmitter, Injectable } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from '../utils/utils';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  _usersName: string;
  audioStream!: MediaStream;
  speechRecognition!: SpeechRecognition;
  recognitionIntent: SPEECH_RECOGNITION_INTENT;
  micPermission = new EventEmitter<PermissionState>();
  speechResults = new EventEmitter<SpeechRecognitionEvent>();
  constructor() {}

  set usersName(name) {
    this._usersName = name;
  }

  get usersName() {
    return this._usersName;
  }

  get isSpeechSupported() {
    return 'speechSynthesis' in window;
  }

  async hasMicPermission() {
    const permName = 'micropphone' as PermissionName;
    const permission = await navigator.permissions.query({ name: permName });
    return permission.state === 'granted';
  }

  askMicPermission() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(
        (stream) => {
          this.audioStream = stream;
          this.micPermission.emit(MediaPermissionState.granted);
        },
        () => {
          console.log('Mic permission denied');
          this.micPermission.emit(MediaPermissionState.denied);
        }
      );
  }

  speak(text: string) {
    if (this.isSpeechSupported) {
      let speech = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(speech);
    } else {
      console.log('Speech not supported');
    }
  }

  speechToTextInit() {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognition = new speechRecognition();
    this.speechRecognition.lang = 'en-US';
    this.speechRecognition.onresult = this.recognizeSpeech;
  }

  speechRecognitionEnd() {
    // Restart as it ends automatically, this will keep it alive
    this.speechRecognition.onend = () => {
      this.startSpeechRecognition();
    };
  }

  startSpeechRecognition() {
    this.speechRecognition.stop();
    this.speechRecognition.start();
  }

  stopSpeechRecognition() {
    this.speechRecognition.stop();
  }

  recognizeSpeech = (audioEvent: SpeechRecognitionEvent) => {
    this.speechResults.emit(audioEvent);
  };

  getSupportedVoices() {
    if (!this.isSpeechSupported) {
      return null;
    }
    let voices = speechSynthesis.getVoices();
    if (!voices.length) {
      this.speak('');
      voices = speechSynthesis.getVoices();
    }
    return voices;
  }
}
