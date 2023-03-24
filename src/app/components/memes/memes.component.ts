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
  constructor(
    private jokeService: JokeService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.getMeme();
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Joke;
  }

  getMeme() {
    const sub = this.jokeService.getMeme().subscribe((meme) => {
      this.memes.push(meme);
      sub.unsubscribe();
    });
  }
}
