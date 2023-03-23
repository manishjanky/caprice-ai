import { EmotionService } from './../../services/emotion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cheer-me-up',
  templateUrl: './cheer-me-up.component.html',
  styleUrls: ['./cheer-me-up.component.scss'],
})
export class CheerMeUpComponent implements OnInit {
  emotion: any;
  constructor(private emotionService: EmotionService) {}

  ngOnInit(): void {
    this.emotionService.detectedEmotion.subscribe((emotion) => {
      const max = Math.max(
        ...(Object.values(emotion?.expressions) as number[])
      );
      this.emotion = Object.keys(emotion?.expressions).filter(
        (key) => emotion?.expressions[key] == max
      )[0];
    });
  }
}
