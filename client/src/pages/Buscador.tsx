import React, { useState, useEffect } from "react";
import axios from "axios";
import { SkeletonLoader } from "../atoms/Skeleton";
import { parseDuration } from "../utils/videoDuration";
import {
  DetailsResponseItem,
  SearchResponseItem,
  Video,
} from "../Types/VideoResponse";
import { CardVideo } from "../atoms/CardVideo";

export const Buscador: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const verifyLog = () => {
      if (localStorage.getItem("nameKaraoki")) {
        return true;
      } else {
        return false;
      }
    };
    if (!verifyLog()) {
      window.location.href = "/loginUser";
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.length < 3) {
        setVideos([]);
      }
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  const API_URL = "https://www.googleapis.com/youtube/v3/search";
  const VIDEO_DETAILS_URL = "https://www.googleapis.com/youtube/v3/videos";
  const maxResults = 10;

  useEffect(() => {
    const fetchVideos = async () => {
      if (query.length < 3) return;

      setLoading(true);

      try {
        const searchResponse = await axios.get(API_URL, {
          params: {
            part: "snippet",
            maxResults,
            q: query,
            type: "video",
            key: import.meta.env.VITE_API_KEY,
          },
        });

        const searchItems: SearchResponseItem[] = searchResponse.data.items;
        const videoIds = searchItems.map((item) => item.id.videoId);

        const detailsResponse = await axios.get(VIDEO_DETAILS_URL, {
          params: {
            part: "contentDetails,snippet",
            id: videoIds.join(","),
            key: import.meta.env.VITE_API_KEY,
          },
        });

        const detailsItems: DetailsResponseItem[] = detailsResponse.data.items;

        const videoResults: Video[] = detailsItems.map((item) => {
          const duration = item.contentDetails.duration;
          const title = item.snippet.title;
          const thumbnail = item.snippet.thumbnails.high.url;
          const url = `https://www.youtube.com/watch?v=${item.id}`;

          return {
            id: item.id,
            title,
            thumbnail,
            duration: parseDuration(duration),
            url,
          };
        });

        setVideos(videoResults);
      } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchVideos();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setQuery(e.target.value);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Busca tu canción!</h1>
      <input
        type="text"
        className="p-2 w-full max-w-lg border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-red-400 focus:ring focus:ring-red-200"
        placeholder="Escribe una canción o artista..."
        value={query}
        onChange={handleChange}
      />

      {loading && (
        <div className="w-full max-w-lg mt-4 space-y-4">
          {[...Array(maxResults)].map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}

      {!loading && (
        <ul className="w-full max-w-lg mt-4 space-y-4">
          {videos.map((video) => (
            <CardVideo key={video.id} video={video} />
          ))}
        </ul>
      )}

      {!loading && videos.length === 0 && (
        <p className="text-gray-100 mt-4">No se encontraron resultados.</p>
      )}
    </div>
  );
};
