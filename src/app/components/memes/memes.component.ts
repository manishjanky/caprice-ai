import { JokeService } from './../../services/joke.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-memes',
  templateUrl: './memes.component.html',
  styleUrls: ['./memes.component.scss'],
})
export class MemesComponent implements OnInit {
  memes: any[] = [];
  constructor(private jokeService: JokeService) {}

  ngOnInit(): void {
    this.getMeme();
  }

  getMeme() {
    const sub = this.jokeService.getMeme().subscribe((meme) => {
      this.memes.push(meme);
      sub.unsubscribe();
    });
  }
}
