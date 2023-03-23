import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  @ViewChild('audioref') audioRef: ElementRef;
  playedTime: string;
  isPlaying: boolean;
  history: any[] = [];
  audio: any;
  constructor() {}
  get duration(): string {
    return (
      (this.audioElement?.duration / 60).toFixed(2).replace('.', ':') || '0:00'
    );
  }
  get image() {
    return this.audio?.image || '/assets/images/audio_player.jpg';
  }
  get audioElement(): HTMLAudioElement {
    return this.audioRef?.nativeElement;
  }
  ngOnInit(): void {}

  playTimeUpdated() {
    this.playedTime = `${
      this.audioElement?.currentTime / this.audioElement?.duration
    } * 100}%`;
  }

  playPause() {
    this.isPlaying ? this.audioElement.pause() : this.audioElement.play();
  }
}
