import { EmotionFrom } from './../utils/enum';
import { HUGGING_FACE } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as faceapi from '@vladmandic/face-api';
@Injectable({
  providedIn: 'root',
})
export class EmotionService {
  modelsPath = '/assets/models';
  detectedEmotion = new EventEmitter<{ emotion: string; from: EmotionFrom }>();
  textEmotion: string;
  videoEmotion: any;
  constructor(private http: HttpClient) {
    this.loadModels();
  }

  async loadModels() {
    await faceapi.loadSsdMobilenetv1Model(this.modelsPath);
    await faceapi.loadFaceLandmarkModel(this.modelsPath);
    await faceapi.loadFaceExpressionModel(this.modelsPath);

  }

  async detectFaceExpression(input: HTMLVideoElement) {
    const ssdNet = new faceapi.SsdMobilenetv1Options({
      minConfidence: 0.3,
      maxResults: 1,
    });
    this.videoEmotion = await faceapi
      .detectSingleFace(input, ssdNet)
      .withFaceLandmarks()
      .withFaceExpressions();
    this.detectedEmotion.emit({
      emotion: this.getMax(this.videoEmotion?.expressions),
      from: EmotionFrom.video,
    });
    return this.videoEmotion;
  }

  detectTextExpression(text: string) {
    const url = `${environment.huggingFace}${HUGGING_FACE.getEmotionInference}`;
    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      `Bearer ${environment.huggingFaceKey}`
    );
    const sub = this.http.post(url, { inputs: text }, { headers });
    sub.subscribe((data) => {
      // extract text emotion based on highest priority
      this.textEmotion = this.getMax(data[0]);
      this.detectedEmotion.emit({
        emotion: this.textEmotion,
        from: EmotionFrom.video,
      });
    });
    return sub;
  }

  getMax(data) {
    if (!data) {
      return null;
    }
    const max = Math.max(...(Object.values(data) as number[]));
    return Object.keys(data).filter((key) => data[key] == max)[0];
  }

  // detectName(text) {
  //   const url = `${environment.huggingFace}${HUGGING_FACE.getNameFromText}`;
  //   return this.http.post(url, JSON.stringify({ inputs: text }));
  // }

  // detectName(){
  //   async function query(data) {
  //     const response = await fetch(
  //       "https://api-inference.huggingface.co/models/dslim/bert-base-NER",
  //       {
  //         headers: { Authorization: "Bearer {API_TOKEN}" },
  //         method: "POST",
  //         body: JSON.stringify(data),
  //       }
  //     );
  //     const result = await response.json();
  //     return result;
  //   }
  // }
}
