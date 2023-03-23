import { EmotionService } from './../../services/emotion.service';
import { VideoService } from './../../services/video.service';
import {
  Component,
  ElementRef,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MediaPermissionState } from 'src/app/utils/media.utils';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  isCameraActive = false;
  constructor(
    private videoService: VideoService,
    private emotionService: EmotionService
  ) {
    this.videoService.cameraPermission.subscribe(
      (state: MediaPermissionState) => {
        if (state !== MediaPermissionState.granted) {
          console.log('Camera permission denied');
          this.isCameraActive = false;
        } else {
          this.isCameraActive = true;
          this.detectEmotion();
        }
      }
    );
  }
  @ViewChild('video', { static: false }) set videoRef(ref: ElementRef) {
    this.videoElement = ref?.nativeElement;
    this.setElementRefs();
  }
  @ViewChild('canvas', { static: false }) set canvasRef(ref: ElementRef) {
    this.canvasElement = ref?.nativeElement;
    this.setElementRefs();
  }
  ngOnInit() {
    this.videoService.askCameraPermission();
  }

  setElementRefs() {
    this.videoService.videoElement = this.videoElement;
    this.videoService.canvasElement = this.canvasElement;
  }
  detectEmotion() {
    setTimeout(() => {
      this.emotionService.detectFaceExpression(this.videoElement);
    }, 1000);
  }
}
