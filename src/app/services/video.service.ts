import { MediaPermissionState } from '../utils/media.utils';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  videoStream!: MediaStream;
  videoElement!: HTMLVideoElement;
  canvasElement!: HTMLCanvasElement;
  cameraPermission = new EventEmitter<PermissionState>();

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
}
