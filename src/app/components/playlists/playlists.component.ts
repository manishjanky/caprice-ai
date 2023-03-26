import { MusicService } from './../../services/music.service';
import {
  Component,
  EventEmitter,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

@Component({
  selector: 'app-playlists',
  templateUrl: './playlists.component.html',
  styleUrls: ['./playlists.component.scss'],
})
export class PlaylistsComponent implements OnInit {
  myPlaylists: any[] = [];
  play = new EventEmitter<any>();
  constructor(private musicService: MusicService) {
    this.getPlaylists();
  }

  ngOnInit(): void {
    this.musicService.updatePlaylist.subscribe(() => {
      this.getPlaylists();
    });
  }

  getPlaylists() {
    this.myPlaylists = this.musicService.getCapricePlaylists();
  }

  playList(list) {
    this.musicService.playPlaylist.emit(list);
  }
}
