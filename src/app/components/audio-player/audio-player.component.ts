import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Input,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnChanges {
  @ViewChild('audioref') audioRef: ElementRef;
  @ViewChild('volumeRange') volumeRange: ElementRef;
  @Input() audioList: any[] = [];
  playedTime: string;
  isPlaying: boolean;
  history: any[] = [];
  audio: any;
  volume: number = 8;
  constructor(private cdref: ChangeDetectorRef) {}
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
    const val =
      this.volumeRange?.nativeElement.clientWidth * (this.volume / 10);
    return !isNaN(val) ? `${val - 2}px` : 0;
  }
  ngOnInit(): void {
    if (this.audioList.length && !this.audio) {
      this.audio = this.audioList[0];
      this.history.push(this.audio);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['audioList']?.currentValue) {
    //   if (changes['audioList'].previousValue) {
    //     this.audioList = [
    //       ...changes['audioList'].currentValue,
    //       ...changes['audioList'].previousValue,
    //     ];
    //   } else {
    //     this.audioList = [...changes['audioList'].currentValue];
    //   }
    // }

    this.audio = this.audioList[0];
    this.history.push(this.audio);
  }

  playTimeUpdated() {
    this.playedTime = `${
      (this.audioElement?.currentTime / this.audioElement?.duration) * 100
    }%`;
  }

  async playPause() {
    this.isPlaying ? this.audioElement.pause() : await this.audioElement.play();
  }

  volumeChange() {
    this.audioElement.volume = this.volume / 10;
  }

  next() {
    this.audioElement.pause();
    let currentIndex = this.history.indexOf(this.audio);
    if (currentIndex > -1 && currentIndex < this.history.length - 1) {
      this.audio = this.audioList[currentIndex + 1];
    } else {
      currentIndex = this.audioList.indexOf(this.audio);
      if (currentIndex > -1 && currentIndex < this.audioList.length - 1) {
        this.audio = this.audioList[currentIndex + 1];
      }
    }
    this.history.push(this.audio);
    this.audioElement.play();
  }

  previous() {
    this.audioElement.pause();
    const currentIndex = this.history.indexOf(this.audio);
    if (currentIndex > -1 && currentIndex <= this.history.length - 1) {
      this.audio = this.history[currentIndex - 1];
    }
    this.audioElement.play();
  }

  onEnd() {
    const index = this.audioList.indexOf(this.audio);
    this.audio = this.audioList[index + 1];
    this.history.push(this.audio);
  }
}
