import { MUSIC_PLAYING, ExcludeMusic } from './../utils/music.utils';
import { SAAVAN_API } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  saavanUrl = environment.saavanUrl;
  musicPlaying = new EventEmitter<MUSIC_PLAYING>();
  musicSuggestions = new BehaviorSubject(null);
  capricePlaylists: any[] = [];
  songSuggestions: any[] = [];
  constructor(private http: HttpClient) {
    this.capricePlaylists = JSON.parse(
      localStorage.getItem('caprice_playlists')
    );
  }
  searchSong(text: string, page = 1) {
    return this.http.get(
      `${this.saavanUrl}${SAAVAN_API.searchSongs}?query=${text}&page=${page}`
    );
  }

  searchPlaylist(text: string, page = 1) {
    const sub = this.http.get(
      `${this.saavanUrl}${SAAVAN_API.searchPlaylist}?query=${text}&page=${page}&limit=5`
    );
    sub.subscribe((lists: any) => {
      lists.data?.results.forEach((list) => {
        let process = true;
        ExcludeMusic.forEach((exc) => {
          if (list.name.toLowerCase().indexOf(exc) > -1) {
            process = false;
          }
        });
        if (process) {
          this.getPlaylistById(list.id);
        }
      });
    });
    return sub;
  }

  getPlaylistById(id: string) {
    const sub = this.http.get(
      `${this.saavanUrl}${SAAVAN_API.getPlaylist}?id=${id}`
    );
    sub.subscribe((result: any) => {
      let songs = result.data.songs;
      ExcludeMusic.forEach((exc) => {
        songs = songs.filter(
          (song) => song.name.toLowerCase().indexOf(exc) === -1
        );
      });

      this.songSuggestions = [...this.songSuggestions, ...songs];
      this.musicSuggestions.next(this.setSongProperties(this.songSuggestions));
    });
    return sub;
  }
  startPlayingMusic() {
    this.musicPlaying.emit(MUSIC_PLAYING.Start);
  }
  sopPlayingMusic(reason: MUSIC_PLAYING) {
    this.musicPlaying.emit(reason);
  }

  createPlaylist(name: string) {
    this.capricePlaylists.push({
      name: name,
      songs: [],
    });
    localStorage.setItem(
      'caprice_playlists',
      JSON.stringify(this.capricePlaylists)
    );
  }

  addSongToPlaylist(song: any, listName?: string) {
    const { name, link, image, by, id } = song;
    const ind = this.capricePlaylists.findIndex(
      (list) => list.name === listName
    );
    if (ind > -1) {
      this.capricePlaylists[ind].songs.push({ name, link, image, by, id });
    }
    localStorage.setItem(
      'caprice_playlists',
      JSON.stringify(this.capricePlaylists)
    );
  }

  setSongProperties(songs) {
    const songsList = [];
    songs?.forEach((song) => {
      const images = song?.image;
      song.by = song?.primaryArtists;
      if (images && images.length > 0) {
        const url = images[images.length - 1]?.link;
        if (url) {
          song.image = url || '/assets/images/audio_player.jpeg';
        }
      }
      if (song.image)
        if (song.downloadUrl) {
          song.link = song?.downloadUrl[song?.downloadUrl?.length - 1]?.link;
          songsList.push(song);
        }
    });
    return songsList;
  }
}
