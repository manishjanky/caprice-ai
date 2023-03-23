export const JOKE_API = {
  getJoke: '/joke',
};

export const MEME_API = {
  getRandom: '/gimme',
  getFromSubreddit: '/gimme/$subreddit',
};

export const HUGGING_FACE = {
  getEmotionInference: '/models/arpanghoshal/EmoRoBERTa',
  getNameFromText:'/models/opensource/extract_names'
};

export const SAAVAN_API = {
  search: '/search/all',
  searchSongs: '/search/songs',
  searchAlbum: '/search/albums',
  searchArtist: '/search/artists',
  searchPlaylist: '/search/playlists',
};

export const ZEN_QUOTES_API = {
  getQuote: '/api/random',
};
