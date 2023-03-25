import { MUSIC_PLAYING } from './../utils/music.utils';
import { SAAVAN_API } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  saavanUrl = environment.saavanUrl;
  musicPlaying = new EventEmitter<MUSIC_PLAYING>();
  constructor(private http: HttpClient) {}
  searchSong(text: string, page = 1) {
    return this.http.get(
      `${this.saavanUrl}${SAAVAN_API.searchSongs}?query=${text}&page=${page}`
    );
  }
  startPlayingMusic() {
    this.musicPlaying.emit(MUSIC_PLAYING.Start);
  }
  sopPlayingMusic(reason: MUSIC_PLAYING) {
    this.musicPlaying.emit(reason);
  }
}
