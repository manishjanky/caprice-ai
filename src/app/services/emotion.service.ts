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
  }

  detectTextExpression(text: string) {
    const url = `${environment.huggingFace}${HUGGING_FACE.getEmotionInference}`;
    return this.http.post(url, { inputs: text });
  }

  detectName(text) {
    const url = `${environment.huggingFace}${HUGGING_FACE.getNameFromText}`;
    return this.http.post(url, JSON.stringify({ inputs: text }));
  }

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
