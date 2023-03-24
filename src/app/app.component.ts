import { environment } from './../environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpeechService } from './services/speech.service';
import { EmotionService } from './services/emotion.service';
import { Component } from '@angular/core';
import { HUGGING_FACE } from './utils/api.utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'caprice-ai';
  constructor(
    private emotionService: EmotionService,
    private http: HttpClient
  ) {
    // load model so they are ready to use
    this.emotionService.loadModels();
  }
}
