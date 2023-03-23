import { EmotionService } from './../../services/emotion.service';
import { VideoService } from './../../services/video.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { drawConnectors } from '@mediapipe/drawing_utils';
import { isSafari } from 'src/app/utils/utils';
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  isCameraActive = false;
  faceMesh: FaceMesh;
  faceMeshResult: Results;
  isMeshVisible = false;
  constructor(
    private videoService: VideoService,
    private emotionService: EmotionService,
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
    this.setUpFaceMesh();
    setTimeout(() => {
      this.emotionService.detectFaceExpression(this.videoElement);
    }, 1000);
  }

  async setUpFaceMesh() {
    if (isSafari()) {
      // this.toastService.info(
      //   'Safari does not support Media pipe face mesh. Please use chrome instead.'
      // );
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

  drawMesh() {
    this.isMeshVisible = false;
    const ctx = this.canvasElement.getContext('2d');
    ctx.save();
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    ctx.drawImage(
      this.faceMeshResult.image,
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
  }
}
