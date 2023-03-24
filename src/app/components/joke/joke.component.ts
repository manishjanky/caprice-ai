import { SpeechService } from './../../services/speech.service';
import { JOKE_TYPE } from './../../utils/joke-meme.utils';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-joke',
  templateUrl: './joke.component.html',
  styleUrls: ['./joke.component.scss'],
})
export class JokeComponent implements OnInit {
  @Input() joke: any;
  type = JOKE_TYPE;
  constructor(private speechService: SpeechService) {}

  ngOnInit(): void {
    this.speakJoke();
  }

  speakJoke() {
    if (!this.isSpeechAvailable) {
      return;
    }
    if (this.joke.type === this.type.Single) {
      this.speechService.speak(
        SPEAK_JOKE.JokeCategoryText.replace('$replace', this.joke.category)
      );
      this.speechService.speak(this.joke.joke);
    } else {
      this.speechService.speak(
        SPEAK_JOKE.JokeCategoryText.replace('$replace', this.joke.category)
      );
      this.speechService.speak(this.joke.setup);
      setTimeout(() => {
        this.speechService.speak(this.joke.delivery);
      }, 1000);
    }
  }
}
