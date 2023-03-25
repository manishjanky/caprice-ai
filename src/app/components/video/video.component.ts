import { GESTURE_TYPES } from './../../utils/utils';
import { VIDEO_PROCESSING_MESSAGE } from './../../utils/mediapipe.utils';
import { EmotionService } from './../../services/emotion.service';
import { VideoService } from './../../services/video.service';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MediaPermissionState } from 'src/app/utils/media.utils';
import {
  FaceMesh,
  FACEMESH_FACE_OVAL,
  FACEMESH_LEFT_EYE,
  FACEMESH_LEFT_EYEBROW,
  FACEMESH_LEFT_IRIS,
  FACEMESH_LIPS,
  FACEMESH_RIGHT_EYE,
  FACEMESH_RIGHT_EYEBROW,
  FACEMESH_RIGHT_IRIS,
  FACEMESH_TESSELATION,
  Results,
  VERSION,
} from '@mediapipe/face_mesh';
import { FaceMeshConfig } from 'src/app/utils/mediapipe.utils';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { isSafari } from 'src/app/utils/utils';
import { draw, resizeResults } from '@vladmandic/face-api';
import { GestureRecognizer, FilesetResolver } from '@mediapipe/tasks-vision';
import { HAND_CONNECTIONS } from '@mediapipe/hands';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit, OnDestroy {
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  gestureCanvasElement!: HTMLCanvasElement;
  isCameraActive = false;
  faceMesh: FaceMesh;
  faceMeshResult: Results;
  isMeshVisible = false;
  gestureRecognizer: GestureRecognizer;
  gestureInterval: any;
  videoMessage: string;
  detectingEmotion = true;
  constructor(
    private videoService: VideoService,
    private emotionService: EmotionService,
    private cdref: ChangeDetectorRef
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

  @ViewChild('gestureCanvas', { static: false }) set gestureCanvasRef(
    ref: ElementRef
  ) {
    this.gestureCanvasElement = ref?.nativeElement;
  }
  ngOnInit() {
    this.videoService.askCameraPermission();
    this.videoService.detectedGesture.subscribe((gesture) => {
      if (gesture.categoryName && gesture.categoryName !== GESTURE_TYPES.None) {
        this.videoMessage = `Detected gesture - ${gesture.categoryName
          .replace('_', ' ')
          .toUpperCase()}`;
        setTimeout(() => {
          this.videoMessage = '';
        }, 2000);
      }
    });
    this.emotionService.detectedEmotion.subscribe((expression) => {
      this.detectingEmotion = false;
      if (expression && expression.emotion) {
        this.videoMessage = `Detected expression - ${expression.emotion.toUpperCase()}`;
        setTimeout(() => {
          this.videoMessage = '';
        }, 2000);
      } else {
        this.detectEmotion();
      }
    });
  }

  setElementRefs() {
    this.videoService.videoElement = this.videoElement;
    this.videoService.canvasElement = this.canvasElement;
    // if (this.videoElement && this.canvasElement && !this.gestureRecognizer) {

    // }
  }

  async detectEmotion() {
    this.videoMessage = VIDEO_PROCESSING_MESSAGE.detectingExpression;
    await this.setUpFaceMesh();
    setTimeout(async () => {
      await this.emotionService.detectFaceExpression(this.videoElement);
      this.checkToDrawMesh();
    }, 500);
  }

  checkToDrawMesh() {
    const interval = setInterval(() => {
      if (this.faceMeshResult) {
        this.drawMesh();
        clearInterval(interval);
      }
    }, 100);
  }
  async setUpFaceMesh() {
    if (isSafari()) {
      return;
    }
    const config = {
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@${VERSION}/${file}`;
      },
    };
    this.faceMesh = await new FaceMesh(config);
    this.faceMesh.setOptions(FaceMeshConfig);
    this.faceMesh.onResults((results: Results) => {
      this.faceMeshResult = results;
    });
    const camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await this.faceMesh.send({ image: this.videoElement });
      },
      width: this.videoElement.clientWidth,
      height: this.videoElement.clientHeight,
    });
    camera.start();
  }
  clearFaceMesh() {
    const ctx = this.canvasElement.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }
  drawMeshNonSafari() {
    const detectionsForSize = resizeResults(this.emotionService.videoEmotion, {
      width: this.videoElement.clientWidth,
      height: this.videoElement.clientHeight,
    });
    // draw them into a canvas
    setTimeout(() => {
      draw.drawFaceLandmarks(this.canvasElement, detectionsForSize);
      draw.drawDetections(this.canvasElement, detectionsForSize);
    }, 100);
  }
  drawMesh(clear = true) {
    if (isSafari()) {
      this.drawMeshNonSafari();
      this.cdref.markForCheck();
      return;
    }
    const ctx = this.canvasElement.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.drawImage(
      this.faceMeshResult?.image,
      0,
      0,
      this.canvasElement.width,
      this.canvasElement.height
    );
    if (this.faceMeshResult.multiFaceLandmarks) {
      for (const landmarks of this.faceMeshResult.multiFaceLandmarks) {
        drawConnectors(ctx, landmarks, FACEMESH_TESSELATION, {
          color: '#c0c0c070',
          lineWidth: 0.5,
        });
        drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYE, {
          color: '#ff3030',
        });
        drawConnectors(ctx, landmarks, FACEMESH_RIGHT_EYEBROW, {
          color: '#ff3030',
        });
        drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYE, {
          color: '#30ff30',
        });
        drawConnectors(ctx, landmarks, FACEMESH_LEFT_EYEBROW, {
          color: '#30ff30',
        });
        drawConnectors(ctx, landmarks, FACEMESH_FACE_OVAL, {
          color: '#e0e0e0',
        });
        drawConnectors(ctx, landmarks, FACEMESH_LIPS, {
          color: '#e0e0e0',
        });
        if (FaceMeshConfig.refineLandMarks) {
          drawConnectors(ctx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: '#ff3030',
          });
          drawConnectors(ctx, landmarks, FACEMESH_LEFT_IRIS, {
            color: '#30ff30',
          });
        }
      }
    }
    if (clear) {
      setTimeout(() => {
        this.clearFaceMesh();
        this.initGestures();
      }, 2000);
    }
  }

  async initGestures() {
    const ctx = this.canvasElement.getContext('2d');
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
    );
    this.gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          'https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task',
      },
      runningMode: 'VIDEO',
    });

    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    this.gestureInterval = setInterval(() => {
      this.drawGesture();
    }, 100);
  }

  drawGesture() {
    if (this.detectingEmotion) {
      return;
    }
    const ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    let nowInMs = Date.now();
    if (!this.gestureRecognizer) {
      return;
    }
    const results = this.gestureRecognizer.recognizeForVideo(
      this.videoElement,
      nowInMs
    );
    if (!results.gestures.length) {
      return;
    } else {
      if (
        this.videoService.lastDetectedGesture?.categoryName !==
        results.gestures[0][0].categoryName
      ) {
        this.videoMessage = VIDEO_PROCESSING_MESSAGE.detectingGesture;
      }
      this.videoService.gestureDetected(results.gestures);
    }
    if (results.landmarks) {
      for (const landmarks of results.landmarks) {
        drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
          lineWidth: 1,
          color: '#1d6d86;',
        });
        drawLandmarks(ctx, landmarks, { color: '#effaf6', lineWidth: 1 });
      }
    }
    ctx.restore();
  }

  ngOnDestroy(): void {
    clearInterval(this.gestureInterval);
  }
}
