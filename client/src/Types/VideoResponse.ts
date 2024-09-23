export interface SearchResponseItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      default: {
        url: string;
      };
    };
  };
}

export interface DetailsResponseItem {
  id: string;
  contentDetails: {
    duration: string;
  };
  snippet: {
    title: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
}

export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  url: string;
  youtube_id?: string;
  user_name?: string;
  fecha_agregado?: string | number | Date;
  table_id?: number;
}

export interface User {
  id: number;
  name: string;
}

export interface Song {
  youtube_id: string;
  title: string;
  duration: string;
  url: string;
  thumbnail: string;
}

export interface Table {
  id: number;
  table_number: number;
  max_songs: number;
  users: User[];
  songs: Video[];
  estado: boolean;
}
