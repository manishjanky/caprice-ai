import { MusicService } from './../../services/music.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent {
  myPlaylists: any[] = [];

  constructor(private musicService: MusicService) {
    this.myPlaylists = this.musicService.getCapricePlaylists();
  }
}
