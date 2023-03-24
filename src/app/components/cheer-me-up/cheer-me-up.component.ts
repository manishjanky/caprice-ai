import { EmotionService } from './../../services/emotion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cheer-me-up',
  templateUrl: './cheer-me-up.component.html',
  styleUrls: ['./cheer-me-up.component.scss'],
})
export class CheerMeUpComponent implements OnInit {
  emotion: any;
  songName: string;
  isSearchingSong: boolean;
  constructor(private emotionService: EmotionService) {}

  ngOnInit(): void {
    this.emotionService.detectedEmotion.subscribe((emotion: any) => {
      this.emotion = emotion?.emotion;
    });
  }

  searchSong() {}
}
