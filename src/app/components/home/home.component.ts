import { EmotionService } from './../../services/emotion.service';
import { CapricePrompts, NameResponseTemplate } from './../../utils/utils';
import { SpeechService } from './../../services/speech.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private speechService: SpeechService,
    private emotionService: EmotionService
  ) {
    this.speechService.speechResults.subscribe((result) => {
      this.speechResults(result);
    });
  }

  ngOnInit() {
    this.speechService.speak(
      `${CapricePrompts.greetings} ${
        !this.speechService.usersName ? CapricePrompts.askName : ''
      }`
    );
    this.speechService.speechToTextInit();
    this.speechService.startSpeechRecognition();
  }

  speechResults(results: SpeechRecognitionEvent) {
    if (!this.speechService.usersName) {
      this.extractName(results.results[0][0]?.transcript);
    } else {
      this.emotionService.detectTextExpression(
        results.results[0][0]?.transcript
      );
    }
  }

  extractName(identifiedText: string) {
    let name: string;
    name = identifiedText.toLowerCase();
    for (let str of NameResponseTemplate) {
      name = name.replace(new RegExp(str, 'g'), '');
      console.log(name);
    }
    this.speechService.usersName = name;
    this.speechService.speak('Hi! ' + name + CapricePrompts.howAreYou);
  }
}
