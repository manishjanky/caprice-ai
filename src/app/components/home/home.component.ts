import { CapricePrompts, NameResponseTemplate } from './../../utils/utils';
import { SpeechService } from './../../services/speech.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private speechService: SpeechService) {
    this.speechService.speechResults.subscribe((result) => {
      this.speechResults(result);
    });
  }

  ngOnInit() {
    this.speechService.speak(
      `${CapricePrompts.greetings} ${CapricePrompts.askName}`
    );
    this.speechService.speechToTextInit();
    this.speechService.startSpeechRecognition();
  }

  speechResults(results: SpeechRecognitionEvent) {
    this.extractName(results.results[0][0]?.transcript);
    // console.log(results);
  }

  extractName(identifiedText: string) {
    let name: string;
    identifiedText = identifiedText.toLowerCase();
    if (!this.speechService.usersName) {
      NameResponseTemplate.forEach((temp) => {
        name = identifiedText.toLowerCase().replace(temp.toLowerCase(), '');
      });
      this.speechService.usersName = name;
      this.speechService.speak('Hi! ' + name + CapricePrompts.howAreYou);
    }
  }

  getStarted() {}
}
