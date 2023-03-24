import { JOKE_CATEGORY } from './../utils/joke-meme.utils';
import { HUGGING_FACE, JOKE_API, MEME_API } from './../utils/api.utils';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JokeService {
  jokeApiUrl = environment.jokeApiUrl;
  memeApiUrl = environment.memeApiUrl;
  huggingFaceUrl = environment.huggingFace;
  constructor(private http: HttpClient) {}

  getJoke(category?: string): Observable<any> {
    category = Object.values(JOKE_CATEGORY).join(',');
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

  generateImage(description: string) {
    let headers = new HttpHeaders();
    headers = headers.append(
      'Authorization',
      `Bearer ${environment.huggingFaceKey}`
    );
    return this.http.post(
      `${this.huggingFaceUrl}${HUGGING_FACE.generateImage}`,
      { inputs: description },
      { headers: headers, observe: 'response', responseType: 'blob' }
    );
  }
}
