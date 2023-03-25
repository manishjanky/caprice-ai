import {
  CapricePrompts,
  HappyMusicEmotions,
  CalmingMusicEmotions,
  LoveMusicEmotions,
} from './../../utils/utils';
import { SpeechService } from './../../services/speech.service';
import { MusicService } from './../../services/music.service';
import { EmotionFrom } from './../../utils/enum';
import { EmotionService } from './../../services/emotion.service';
import { Component, OnInit } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from 'src/app/utils/utils';
import { last } from 'rxjs';

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
  songSuggestions: any[] = [];
  constructor(
    private emotionService: EmotionService,
    private musicService: MusicService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.textDetectedEmotion = this.emotionService.textEmotion;
    this.speechService.speak(CapricePrompts.chooseOption);
    this.emotionService.detectedEmotion.subscribe((emotion: any) => {
      if (emotion?.from === EmotionFrom.text) {
        this.textDetectedEmotion = emotion.emotion;
      }
      if (!this.videoDetectedEmotion && emotion?.from === EmotionFrom.video) {
        this.videoDetectedEmotion = emotion.emotion;
      }
      if (
        (this.textDetectedEmotion || !this.emotionService.answer) &&
        this.videoDetectedEmotion
      ) {
        this.suggestMusic();
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
    this.musicService.musicSuggestions.subscribe((suggestions) => {
      this.songSuggestions = suggestions;
      this.songs = this.songSuggestions;
    });
  }

  searchSong() {
    this.isSearchingSong = true;
    const sub = this.musicService
      .searchSong(this.songName)
      .subscribe((songs: any) => {
        this.songs = this.musicService.setSongProperties(songs?.data?.results);
        this.songSuggestions = this.songs;
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

  suggestMusic() {
    if (
      HappyMusicEmotions.indexOf(this.textDetectedEmotion) > -1 ||
      HappyMusicEmotions.indexOf(this.videoDetectedEmotion) > -1
    ) {
      this.searchPlaylists('happy music');
      return;
    }

    if (
      CalmingMusicEmotions.indexOf(this.textDetectedEmotion) > -1 ||
      CalmingMusicEmotions.indexOf(this.videoDetectedEmotion) > -1
    ) {
      this.searchPlaylists('soothing music');
      return;
    }

    if (
      LoveMusicEmotions.indexOf(this.textDetectedEmotion) > -1 ||
      LoveMusicEmotions.indexOf(this.videoDetectedEmotion) > -1
    ) {
      this.searchPlaylists('romantic music');
      return;
    }
  }

  searchPlaylists(mood: string) {
    this.musicService.searchPlaylist(mood);
  }

  playSong(song: any) {}
}
