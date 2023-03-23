import { JOKE_API, MEME_API } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  jokeApiUrl = environment.jokeApiUrl;
  memeApiUrl = environment.memeApiUrl;
  constructor(private http: HttpClient) {}

  getJoke(category: string = 'Any'): Observable<any> {
    return this.http.get(`${this.jokeApiUrl}${JOKE_API.getJoke}/${category}`);
  }

  getMeme(subreddit?: string): Observable<any> {
    return this.http.get(
      `${this.memeApiUrl}${
        subreddit
          ? MEME_API.getFromSubreddit.replace('$subreddit', subreddit)
          : MEME_API.getRandom
      }`
    );
  }
}
