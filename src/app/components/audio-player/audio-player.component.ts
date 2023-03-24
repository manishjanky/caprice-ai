import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit {
  @ViewChild('audioref') audioRef: ElementRef;
  @ViewChild('volumeRange') volumeRange: ElementRef;
  playedTime: string;
  isPlaying: boolean;
  history: any[] = [];
  audio: any;
  volume: number = 8;
  constructor() {}
  get duration(): string {
    const duration = this.audioElement?.duration / 60;
    return !isNaN(duration) ? duration.toFixed(2).replace('.', ':') : '0:00';
  }
  get image() {
    return this.audio?.image || '/assets/images/audio_player.jpg';
  }
  get audioElement(): HTMLAudioElement {
    return this.audioRef?.nativeElement;
  }

  get activeVolume() {
    // alert(`${this.volumeRange?.nativeElement?.width * (this.volume / 10) - 42}px`);
    return `${this.volumeRange?.nativeElement.clientWidth * (this.volume / 10) - 2}px`;
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

  volumeChange() {
    this.audioElement.volume = this.volume / 10;
  }
}
