import { AddToPlaylistComponent } from './../add-to-playlist/add-to-playlist.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MusicService } from './../../services/music.service';
import { SpeechService } from './../../services/speech.service';
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
  OnDestroy,
  AfterViewChecked,
  Output,
  EventEmitter,
} from '@angular/core';
import { Category } from '@mediapipe/tasks-vision';
import {
  educateMessage,
  MUSIC_CONTROL_ACTIONS,
  MUSIC_PLAYING,
} from 'src/app/utils/music.utils';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @ViewChild('audioref') audioRef: ElementRef;
  @ViewChild('volumeRange') volumeRange: ElementRef;
  @ViewChild('handSignals') handSignals: ElementRef;
  @Input() audioList: any[] = [];
  @Input() isActive: boolean;
  @Input() playingIndex: number;
  playedTime: string;
  isPlaying: boolean;
  history: any[] = [];
  audio: any;
  volume: number = 8;
  educating = true;
  activeVolumeWidth: string | number;
  constructor(
    private videoService: VideoService,
    private speechSerice: SpeechService,
    private musicService: MusicService,
    private modalService: NgbModal
  ) { }
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

  setActiveVolume() {
    const val =
      this.volumeRange?.nativeElement.clientWidth * (this.volume / 10);
    this.activeVolumeWidth = !isNaN(val) ? `${val - 2}px` : 0;
  }
  ngOnInit(): void {
    if (this.audioList.length && !this.audio) {
      this.audio = this.audioList[0];
      this.history.push(this.audio);
    }
    this.videoService.detectedGesture.subscribe((gesture: Category) => {
      if (this.isActive) {
        this.handleGesture(gesture);
      }
    });
    this.play();
    // this.speechSerice.speak(educateMessage, () => {
    //   this.educate(0);
    // });

    this.musicService.musicPlaying.subscribe((action) => {
      switch (action) {
        case MUSIC_PLAYING.Pause:
        case MUSIC_PLAYING.Stop:
          this.pause();
          break;
        case MUSIC_PLAYING.Start:
          this.play();
          break;
      }
    });
  }

  ngAfterViewChecked(): void {
    this.setActiveVolume();
  }

  educate = (startIndex) => {
    if (!startIndex) {
      startIndex = 0;
    }
    if (startIndex >= MUSIC_CONTROL_ACTIONS.length) {
      this.educating = false;
      return;
    }
    this.speechSerice.speak(MUSIC_CONTROL_ACTIONS[startIndex], () => {
      const index = startIndex + 1;
      this.educate(index);
    });
  };
  handleGesture(gesture: Category) {
    const action = gesture?.categoryName;
    switch (action) {
      case GESTURE_TYPES.None:
      default:
        break;
      case GESTURE_TYPES.Thumb_Down:
        this.speechSerice.speak('Decreasing volume', () => {
          this.volume--;
          this.volumeChange();
        });
        break;
      case GESTURE_TYPES.Open_Palm:
        if (this.isPlaying) {
          this.speechSerice.speak('Pausing music', () => {
            this.pause();
          });
        }
        break;
      case GESTURE_TYPES.Thumb_Up:
        this.speechSerice.speak('Playing previous track', () => {
          this.previous();
        });
        break;
      case GESTURE_TYPES.Pointing_Up:
        this.speechSerice.speak('Increasing volume', () => {
          this.volume++;
          this.volumeChange();
        });
        break;
      case GESTURE_TYPES.Closed_Fist:
        this.speechSerice.speak('Playing next track', () => {
          this.next();
        });
        break;
      case GESTURE_TYPES.Victory:
        if (!this.isPlaying) {
          this.speechSerice.speak('Playing music', () => {
            this.play();
          });
        }
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.audio = this.audioList[0];
    this.history.push(this.audio);
    if (!this.educating) {
      this.play();
    }
    if (changes && changes['playingIndex'].currentValue >= 0 && changes['playingIndex'].currentValue !== changes['playingIndex'].previousValue) {
      this.pickASong(changes['playingIndex'].currentValue);
    }
  }
  play() {
    setTimeout(() => {
      this.audioElement?.play();
      this.isPlaying = true;
    }, 10);
  }
  pause() {
    this.audioElement?.pause();
    this.isPlaying = false;
  }

  playTimeUpdated() {
    this.playedTime = `${(this.audioElement?.currentTime / this.audioElement?.duration) * 100
      }%`;
  }

  playPause() {
    this.isPlaying ? this.pause() : this.play();
  }

  volumeChange() {
    if (this.volume > 10) {
      this.volume = 10;
    }
    this.audioElement.volume = this.volume / 10;
    this.setActiveVolume();
  }
  pickASong(index: number) {
    let currentIndex = index;
    if (currentIndex > -1 && currentIndex < this.history.length - 1) {
      this.audio = this.audioList[currentIndex];
    } else {
      currentIndex = this.audioList.indexOf(this.audio);
      if (currentIndex > -1 && currentIndex < this.audioList.length - 1) {
        this.audio = this.audioList[currentIndex];
      }
    }
    this.history.push(this.audio);
    this.play();
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
    if (!currentIndex || currentIndex === -1) {
      this.audio = this.history[0];
    }
    this.play();
  }

  onEnd() {
    const index = this.audioList.indexOf(this.audio);
    this.audio = this.audioList[index + 1];
    this.history.push(this.audio);
    this.play();
  }

  ngOnDestroy() {
    this.pause();
    this.audio = null;
    this.history = [];
  }

  addToPlaylist() {
    const modalRef = this.modalService.open(AddToPlaylistComponent);
    modalRef.componentInstance.submit.subscribe((list) => {
      this.musicService.addSongToPlaylist(this.audio, list.name);
      modalRef.close();
    });
  }

  showHandSingnals() {
    this.modalService.open(this.handSignals);
    this.educate(0);
  }
}
