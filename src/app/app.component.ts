import { EmotionService } from './services/emotion.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'caprice-ai';
  constructor(private emotionService: EmotionService){
    // load model so they are ready to use
    this.emotionService.loadModels();
  }
}
