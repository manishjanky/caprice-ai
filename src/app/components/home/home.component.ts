import { HowAreYouComponent } from './../how-are-you/how-are-you.component';
import { EmotionService } from './../../services/emotion.service';
import { CapricePrompts, NameResponseTemplate } from './../../utils/utils';
import { SpeechService } from './../../services/speech.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private speechService: SpeechService,
    private emotionService: EmotionService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.speechService.speak(`${CapricePrompts.greetings}`);
  }

  getStarted() {
    this.modalService.open(HowAreYouComponent, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg',
    });
    this.speechService.speak('How are you feeling today?');
  }
}
