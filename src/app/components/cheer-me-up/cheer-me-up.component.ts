import { MusicService } from './../../services/music.service';
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
  songs: any[] = [];
  constructor(
    private emotionService: EmotionService,
    private musicService: MusicService
  ) {}

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

  searchSong() {
    const sub = this.musicService
      .searchSong(this.songName)
      .subscribe((songs: any) => {
        songs.data?.results?.forEach((song) => {
          song.link = song.downloadUrl[song?.downloadUrl?.length - 1].link;
          song.image = song.image[song?.image?.length - 1].link;
        });
        this.songs = songs.data?.results;
        sub.unsubscribe();
      });
  }
}
