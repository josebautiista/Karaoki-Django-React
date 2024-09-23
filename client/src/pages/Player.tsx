import React, { useContext, useEffect, useState } from "react";
import { Video } from "../Types/VideoResponse";
import { AppContext, AppContextType } from "../context/AppProvider";
import { api } from "../config/axiosConfig";
import { YoutubeVideo } from "../atoms/YoutubeVideo";
import { FaCheckCircle } from "react-icons/fa";

export const Player: React.FC = () => {
  const [playlist, setPlaylist] = useState<Video[]>([]);
  const { empresa } = useContext(AppContext) as AppContextType;
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [changed, setChanged] = useState<boolean>(false);

  useEffect(() => {
    if (!empresa) return;

    const fetchPlaylist = async () => {
      try {
        const response = await api.post("/playlist/getPlaylist/", {
          empresa_id: empresa?.id,
        });
        console.log(response.data);
        setPlaylist(response.data);
        if (response.data.length > 0) {
          setVideoUrl(response.data[0]?.url || "");
        }
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    };

    fetchPlaylist();
  }, [empresa, changed]);

  const handleVideoEnd = () => {
    const currentVideoIndex = playlist.findIndex(
      (video) => video.url === videoUrl
    );
    const nextIndex = (currentVideoIndex + 1) % playlist.length;
    const nextUrl = playlist[nextIndex]?.url || "";
    setVideoUrl(nextUrl);
  };

  const handleVideoSelect = (index: number) => {
    const selectedUrl = playlist[index]?.url || "";
    setVideoUrl(selectedUrl);
  };

  const handleMarkAsPlayed = async (videoId: string | undefined) => {
    try {
      await api.put(`/playlist/updateState/${videoId}/`).then(() => {
        setChanged(!changed);
      });
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  return (
    <div className="flex h-screen w-full">
      <YoutubeVideo url={videoUrl} handleVideoEnd={handleVideoEnd} />
      <div className="w-1/4 p-4 overflow-y-auto h-full bg-gray-100">
        <h3 className="text-lg font-semibold mb-2">Lista de Reproducción</h3>
        <ul className="space-y-2">
          {playlist.map((video, index) => (
            <li
              key={index}
              onClick={() => handleVideoSelect(index)}
              className={`flex items-start cursor-pointer p-2 rounded-md transition-colors duration-200 ${
                video.url === videoUrl
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-full mr-2 rounded"
              />
              <div className="flex-1">
                <div
                  className={`font-bold ${
                    video.url === videoUrl ? "text-white" : "text-gray-800"
                  }`}
                >
                  {video.title}
                </div>
                <div
                  className={`font-semibold ${
                    video.url === videoUrl ? "text-white" : "text-gray-600"
                  }`}
                >
                  {video.user_name}, mesa: {video.table_id}
                </div>
                <div
                  className={`${
                    video.url === videoUrl ? "text-white" : "text-gray-600"
                  }`}
                >
                  {video.duration} |{" "}
                  {video.fecha_agregado
                    ? new Date(video.fecha_agregado).toLocaleString()
                    : "Fecha no disponible"}
                </div>
              </div>
              <FaCheckCircle
                size={20}
                className="text-green-500 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAsPlayed(video.youtube_id);
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
