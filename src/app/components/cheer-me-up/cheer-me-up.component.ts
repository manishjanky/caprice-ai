import { EmotionFrom } from './../../utils/enum';
import { EmotionService } from './../../services/emotion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cheer-me-up',
  templateUrl: './cheer-me-up.component.html',
  styleUrls: ['./cheer-me-up.component.scss'],
})
export class CheerMeUpComponent implements OnInit {
  deducedEmotion: any;
  songName: string;
  isSearchingSong: boolean;
  textDetectedEmotion: string;
  videoDetectedEmotion: string;
  constructor(private emotionService: EmotionService) {}

  ngOnInit(): void {
    this.emotionService.detectedEmotion.subscribe((emotion: any) => {
      if (emotion?.from === EmotionFrom.text) {
        this.textDetectedEmotion = emotion;
      }
      if (emotion?.from === EmotionFrom.video) {
        this.videoDetectedEmotion = emotion;
      }
    });
  }

  searchSong() {}
}
