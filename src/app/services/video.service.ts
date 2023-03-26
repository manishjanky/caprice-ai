import { MediaPermissionState } from '../utils/media.utils';
import { EventEmitter, Injectable } from '@angular/core';
import { Category } from '@mediapipe/tasks-vision';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  videoStream!: MediaStream;
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  cameraPermission = new EventEmitter<PermissionState>();
  detectedGesture = new EventEmitter<Category>();
  lastDetectedGesture: Category;
  gestureDetectedTimeStamp: any;

  constructor() {}

  async hasCameraPermission() {
    const permName = 'camera' as PermissionName;
    const permission = await navigator.permissions.query({ name: permName });
    return permission.state === 'granted';
  }

  askCameraPermission() {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: this.videoElement?.clientWidth,
        },
      })
      .then(
        (stream) => {
          this.videoStream = stream;
          this.videoElement.srcObject = stream;
          this.cameraPermission.emit(MediaPermissionState.granted);
        },
        () => {
          console.log('Camera permisssion denied');
          this.cameraPermission.emit(MediaPermissionState.denied);
        }
      );
  }

  gestureDetected(gesture: Category[][]) {
    // Consider on detection valid for 3 seconds
    let gest: any = gesture[0];
    gest = gest && gest.length > 0 ? gest[0] : null;
    if (
      gest &&
      (!this.gestureDetectedTimeStamp ||
        Date.now() - this.gestureDetectedTimeStamp > 3000)
    ) {
      this.gestureDetectedTimeStamp = Date.now();
      this.lastDetectedGesture = gest;
      this.detectedGesture.emit(gest);
    }
  }
}
