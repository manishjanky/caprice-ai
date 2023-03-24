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
  isLoading: boolean;
  constructor(
    private jokeService: JokeService,
    private speechService: SpeechService
  ) {}

  ngOnInit(): void {
    this.getJoke();
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Joke;
  }

  getJoke() {
    this.isLoading = true;
    const sub = this.jokeService.getJoke().subscribe((joke) => {
      this.isLoading = false;
      this.jokes.push(joke);
      sub.unsubscribe();
    });
  }
}
