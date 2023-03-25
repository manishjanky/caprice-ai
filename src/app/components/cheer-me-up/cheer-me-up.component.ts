import { SpeechService } from './../../services/speech.service';
import { MusicService } from './../../services/music.service';
import { EmotionFrom } from './../../utils/enum';
import { EmotionService } from './../../services/emotion.service';
import { Component, OnInit } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from 'src/app/utils/utils';

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
  micRecording: boolean;
  activeTab: number;
  constructor(
    private emotionService: EmotionService,
    private musicService: MusicService,
    private speechService: SpeechService
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

    this.speechService.speechResults.subscribe((results) => {
      if (
        this.speechService.recognitionIntent === SPEECH_RECOGNITION_INTENT.Music
      ) {
        const text = results.results[0][0]?.transcript;
        this.songName = text;
        this.searchSong();
      }
    });
  }

  searchSong() {
    this.isSearchingSong = true;
    const songsList = [];
    const sub = this.musicService
      .searchSong(this.songName)
      .subscribe((songs: any) => {
        songs.data?.results?.forEach((song) => {
          song.image = song?.image[song?.image?.length - 1].link;
          if (song.downloadUrl) {
            song.link = song?.downloadUrl[song?.downloadUrl?.length - 1].link;
            songsList.push(song);
          }
        });
        this.songs = songsList;
        this.isSearchingSong = false;
        sub.unsubscribe();
      });
  }

  micMouseDown() {
    this.micRecording = true;
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Music;

    this.speechService.startSpeechRecognition();
  }
  micMouseUp() {
    this.micRecording = false;
    this.speechService.stopSpeechRecognition();
  }

  tabChange(index) {
    this.activeTab = index;
  }
}
