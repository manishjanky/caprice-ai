import { SpeechService } from './../../services/speech.service';
import { JokeService } from './../../services/joke.service';
import { Component, OnInit } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from 'src/app/utils/utils';

@Component({
  selector: 'app-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss'],
})
export class JokesComponent implements OnInit {
  jokes: any[] = [];
  constructor(
    private jokeService: JokeService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.getJoke();
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Joke;
  }

  getJoke() {
    const sub = this.jokeService.getJoke().subscribe((joke) => {
      this.jokes.push(joke);
      sub.unsubscribe();
    });
  }
}
