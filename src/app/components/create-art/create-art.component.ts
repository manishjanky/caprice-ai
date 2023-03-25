import { JokeService } from './../../services/joke.service';
import { SpeechService } from './../../services/speech.service';
import { Component, OnInit, Sanitizer } from '@angular/core';
import { SPEECH_RECOGNITION_INTENT } from 'src/app/utils/utils';
import { delay, retryWhen } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-create-art',
  templateUrl: './create-art.component.html',
  styleUrls: ['./create-art.component.scss'],
})
export class CreateArtComponent implements OnInit {
  description: string;
  src: any;
  isLoading: boolean;
  micRecording: boolean;
  constructor(
    private speechService: SpeechService,
    private jokeService: JokeService,
    private sanitizer: DomSanitizer
  ) {
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Art;
    this.speechService.speechResults.subscribe((results) => {
      if (
        this.speechService.recognitionIntent === SPEECH_RECOGNITION_INTENT.Art
      ) {
        this.description = results.results[0][0]?.transcript;
        this.generateImage();
      }
    });
  }

  ngOnInit(): void {
    this.speechService.speechResults.subscribe((results) => {
      if (
        this.speechService.recognitionIntent === SPEECH_RECOGNITION_INTENT.Art
      ) {
        const text = results.results[0][0]?.transcript;
        this.description = text;
        this.generateImage();
      }
    });
  }
  micMouseDown() {
    this.micRecording = true;
    this.speechService.recognitionIntent = SPEECH_RECOGNITION_INTENT.Art;
    this.speechService.startSpeechRecognition();
  }

  micMouseUp() {
    this.micRecording = false;
    this.speechService.stopSpeechRecognition();
  }
  generateImage() {
    this.src = null;
    this.isLoading = true;
    const sub = this.jokeService
      .generateImage(this.description)
      .pipe(retryWhen((error) => error.pipe(delay(20000))))
      .subscribe((response) => {
        let objectURL = URL.createObjectURL(response.body);
        this.src = this.sanitizer.bypassSecurityTrustResourceUrl(objectURL);
        this.isLoading = false;

        sub.unsubscribe();
      });
  }
}
