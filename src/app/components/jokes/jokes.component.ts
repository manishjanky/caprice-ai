import { JokeService } from './../../services/joke.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jokes',
  templateUrl: './jokes.component.html',
  styleUrls: ['./jokes.component.scss'],
})
export class JokesComponent implements OnInit {
  jokes: any[] = [];
  constructor(private jokeService: JokeService) {}

  ngOnInit(): void {
    this.getJoke();
  }

  getJoke() {
    const sub = this.jokeService.getJoke().subscribe((joke) => {
      this.jokes.push(joke);
      sub.unsubscribe();
    });
  }
}
