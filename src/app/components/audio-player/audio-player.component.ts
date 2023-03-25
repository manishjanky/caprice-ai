import { GESTURE_TYPES } from './../../utils/utils';
import { VideoService } from './../../services/video.service';
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
import { Category } from '@mediapipe/tasks-vision';

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
  constructor(private videoService: VideoService) {}
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
    this.videoService.detectedGesture.subscribe((gesture: Category) => {
      this.handleGesture(gesture);
    });
  }

  educate(){}
  handleGesture(gesture: Category) {
    const action = gesture?.categoryName;
    switch (action) {
      case GESTURE_TYPES.None:
      default:
        break;
      case GESTURE_TYPES.Thumb_Down:
        this.next();
        break;
      case GESTURE_TYPES.Open_Palm:
        this.pause();
        break;
      case GESTURE_TYPES.Thumb_Up:
        this.previous();
        break;
      case GESTURE_TYPES.Pointing_Up:
        this.volume++;
        this.volumeChange();
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.audio = this.audioList[0];
    this.history.push(this.audio);
  }
  play() {
    this.audioElement.play();
  }
  pause() {
    this.audioElement.pause();
  }

  playTimeUpdated() {
    this.playedTime = `${
      (this.audioElement?.currentTime / this.audioElement?.duration) * 100
    }%`;
  }

  async playPause() {
    this.isPlaying ? this.audioElement.pause() : await this.play();
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
    this.play();
  }

  previous() {
    this.audioElement.pause();
    const currentIndex = this.history.indexOf(this.audio);
    if (currentIndex > -1 && currentIndex <= this.history.length - 1) {
      this.audio = this.history[currentIndex - 1];
    }
    this.play();
  }

  onEnd() {
    const index = this.audioList.indexOf(this.audio);
    this.audio = this.audioList[index + 1];
    this.history.push(this.audio);
  }
}
