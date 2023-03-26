import { MusicService } from './../../services/music.service';
import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-add-to-playlist',
  templateUrl: './add-to-playlist.component.html',
  styleUrls: ['./add-to-playlist.component.scss'],
})
export class AddToPlaylistComponent implements OnInit {
  selectedPlaylist: any;
  newPlaylistName: any;
  playlists: any[] = [];
  @Output() submit = new EventEmitter<any>();
  constructor(private musicService: MusicService, private cdref: ChangeDetectorRef) {
    this.playlists = this.musicService.getCapricePlaylists();
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.selectedPlaylist || this.newPlaylistName) {
      this.submit.emit(this.selectedPlaylist || { name: this.newPlaylistName });
    }
  }

  openChange(){
    this.cdref.detectChanges();
  }
}
