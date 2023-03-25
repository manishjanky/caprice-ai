import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmotionService } from './../../services/emotion.service';
import { SpeechService } from './../../services/speech.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-how-are-you',
  templateUrl: './how-are-you.component.html',
  styleUrls: ['./how-are-you.component.scss'],
})
export class HowAreYouComponent implements OnInit {
  micRecording: boolean;
  answer: string;
  constructor(
    private speechService: SpeechService,
    private emotionService: EmotionService,
    private cdref: ChangeDetectorRef,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.speechService.speechResults.subscribe((results) => {
      const text = results.results[0][0]?.transcript;
      this.answer = text;
      this.cdref.detectChanges();
    });
  }

  micMouseDown() {
    this.micRecording = true;
    this.speechService.startSpeechRecognition();
  }

  micMouseUp() {
    this.micRecording = false;
    this.speechService.stopSpeechRecognition();
  }
  onSubmit() {
    this.emotionService.detectTextExpression(this.answer);
    this.router.navigateByUrl('/cheer-me-up');
    this.modalService.dismissAll();

  }
}
