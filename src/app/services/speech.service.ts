import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SpeechService {
  audioStream!: MediaStream;
  speechRecognition!: SpeechRecognition;
  constructor() {}

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
        },
        () => {
          console.log('Mic permission denied');
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
    this.speechRecognition.onresult = this.recognizeSpeech;
  }

  speechRecognitionEnd() {
    // Restart as it ends automatically, this will keep it alive
    this.speechRecognition.onend = () => {
      this.startSpeechRecognition();
    };
  }

  startSpeechRecognition() {
    this.speechRecognition.start();
  }

  stopSpeechRecognition() {
    this.speechRecognition.stop();
  }

  recognizeSpeech = (audioEvent: SpeechRecognitionEvent) => {};

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
