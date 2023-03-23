import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-meme',
  templateUrl: './meme.component.html',
  styleUrls: ['./meme.component.scss']
})
export class MemeComponent implements OnInit {
  @Input() meme: any;
  constructor() { }

  ngOnInit(): void {
  }

}
