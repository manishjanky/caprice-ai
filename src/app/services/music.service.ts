import { SAAVAN_API } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  saavanUrl = environment.saavanUrl;
  constructor(private http: HttpClient) {}
  searchSong(text: string, page = 1) {
    return this.http.get(
      `${this.saavanUrl}${SAAVAN_API.searchSongs}?query=${text}&page=${page}`
    );
  }
}
