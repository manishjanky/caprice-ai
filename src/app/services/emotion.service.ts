import { HUGGING_FACE } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';
@Injectable({
  providedIn: 'root',
})
export class EmotionService {
  modelsPath = '/assets/models';
  detectedEmotion = new EventEmitter<any>();
  constructor(private http: HttpClient) {
    this.loadModels();
  }

  async loadModels() {
    await faceapi.loadSsdMobilenetv1Model(this.modelsPath);
    await faceapi.loadFaceExpressionModel(this.modelsPath);
  }

  async detectFaceExpression(input: HTMLVideoElement) {
    const ssdNet = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.3,
      maxResults: 1,
    });
    const expression = await faceapi
      .detectSingleFace(input, ssdNet)
      .withFaceExpressions();
    this.detectedEmotion.emit(expression);
    alert(expression);
  }

  detectTextExpression(text: string) {
    const url = `${environment.huggingFace}/${HUGGING_FACE.getInference}`;
    return this.http.post(url, { inputs: text });
  }
}
