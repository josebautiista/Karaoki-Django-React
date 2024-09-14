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
}
