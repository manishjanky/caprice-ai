import { SpeechService } from './../../services/speech.service';
import { JokeService } from './../../services/joke.service';
import { Component, OnInit } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from 'src/app/utils/utils';

@Component({
  selector: 'app-memes',
  templateUrl: './memes.component.html',
  styleUrls: ['./memes.component.scss'],
})
export class MemesComponent implements OnInit {
  memes: any[] = [];
  isLoading: boolean;
  constructor(
    private jokeService: JokeService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.getMeme();
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Joke;
  }

  getMeme() {
    this.isLoading = true;
    const sub = this.jokeService.getMeme().subscribe((meme) => {
      this.isLoading = false;
      this.memes.push(meme);
      sub.unsubscribe();
    });
  }
}
