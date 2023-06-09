import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { JokesComponent } from './components/jokes/jokes.component';
import { JokeComponent } from './components/joke/joke.component';
import { MemesComponent } from './components/memes/memes.component';
import { MemeComponent } from './components/meme/meme.component';
import { VideoComponent } from './components/video/video.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { HeaderComponent } from './components/header/header.component';
import { CheerMeUpComponent } from './components/cheer-me-up/cheer-me-up.component';
import { NgbDropdownModule, NgbNavModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateArtComponent } from './components/create-art/create-art.component';
import { FormsModule } from '@angular/forms';
import { HowAreYouComponent } from './components/how-are-you/how-are-you.component';
import { AddToPlaylistComponent } from './components/add-to-playlist/add-to-playlist.component';
import { PlaylistsComponent } from './components/playlists/playlists.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    JokesComponent,
    JokeComponent,
    MemesComponent,
    MemeComponent,
    VideoComponent,
    AudioPlayerComponent,
    HeaderComponent,
    CheerMeUpComponent,
    CreateArtComponent,
    HowAreYouComponent,
    AddToPlaylistComponent,
    PlaylistsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbNavModule,
    NgbPopoverModule,
    NgbDropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
