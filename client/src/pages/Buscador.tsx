import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { SkeletonLoader } from "../atoms/Skeleton";
import { parseDuration } from "../utils/videoDuration";
import {
  DetailsResponseItem,
  SearchResponseItem,
  Video,
} from "../Types/VideoResponse";
import { CardVideo } from "../atoms/CardVideo";
import { HomePlaylist } from "../components/HomePlaylist";
import { IoMdClose } from "react-icons/io";
import { AiOutlineLogout } from "react-icons/ai";
import { AppContext, AppContextType } from "../context/AppProvider";
import { api } from "../config/axiosConfig";

export const Buscador: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [displayPlaylist, setDisplayPlaylist] = useState<boolean>(true);
  const { idMesa, setMaxFetch, user } = useContext(
    AppContext
  ) as AppContextType;

  useEffect(() => {
    const verifyLog = () => {
      return !!localStorage.getItem("nameKaraoki");
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
    if (!idMesa) return;
    const fetchEmpresa = async () => {
      try {
        const response = await api.get(`/table/getOne/${idMesa}`);
        const { cantidad_usuarios, max_songs } = response.data;
        setMaxFetch(Math.floor(max_songs / cantidad_usuarios));
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmpresa();
  }, [idMesa, setMaxFetch]);

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
            youtube_id: item.id,
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

  useEffect(() => {
    if (!loading && videos.length === 0) {
      setDisplayPlaylist(true);
    }
  }, [loading, videos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayPlaylist(false);
    setLoading(true);
    setQuery(e.target.value);
  };

  const clearInput = () => {
    setQuery("");
    setDisplayPlaylist(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("empresaId");
    localStorage.removeItem("idMesa");
    localStorage.removeItem("nameKaraoki");
    localStorage.removeItem("user");
    window.location.href = "/loginUser";
    api.delete(`user/delete/${user?.id}/`);
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="flex flex-col items-center h-full justify-center min-h-screen relative w-full max-w-lg px-4 py-14">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Busca tu canción!
        </h1>

        <button
          className="absolute top-4 right-4 p-2 text-white rounded flex items-center justify-center gap-1"
          onClick={handleLogout}
        >
          Logout <AiOutlineLogout size={20} />
        </button>

        <div className="relative w-full max-w-lg">
          <input
            type="text"
            className="p-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-red-400 focus:ring focus:ring-red-200"
            placeholder="Escribe una canción o artista..."
            value={query}
            onChange={handleChange}
          />
          {query && (
            <IoMdClose
              className="absolute right-2 top-2.5 text-red-700 cursor-pointer"
              size={20}
              onClick={clearInput}
            />
          )}
        </div>

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
              <CardVideo key={video.youtube_id} video={video} env="search" />
            ))}
          </ul>
        )}

        {!loading && videos.length === 0 && (
          <p className="text-gray-100 mt-4">No se encontraron resultados.</p>
        )}

        {displayPlaylist && <HomePlaylist />}
      </div>
    </div>
  );
};
