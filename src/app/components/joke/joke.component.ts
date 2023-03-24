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
    this.speechService.speak('');
  }
}
