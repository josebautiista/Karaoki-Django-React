import React, { useContext, useEffect, useState } from "react";
import { Video } from "../Types/VideoResponse";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "../config/axiosConfig";
import { AppContext, AppContextType } from "../context/AppProvider";
import { FaTrash } from "react-icons/fa";
import { Alert } from "./Alert";

interface CardVideoProps {
  video: Video;
  env: string;
}

export const CardVideo: React.FC<CardVideoProps> = ({ video, env }) => {
  const { idMesa, empresaId, user, maxFetch } = useContext(
    AppContext
  ) as AppContextType;
  const [added, setAdded] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.post(`/playlist/getPlaylist/`, {
          user_id: user?.id,
          table_id: null,
          empresa_id: empresaId,
        });
        response.data.forEach((song: Video) => {
          if (song.youtube_id === video.youtube_id) {
            setAdded(true);
          }
        });
      } catch {
        console.log("Error fetching playlist");
      }
    };

    fetchSongs();
  }, [empresaId, user, video, added]);

  const addVideo = async () => {
    try {
      const response = await api.get(`playlist/getUser/${user?.id}/`);
      const cantidadCanciones = response.data.count;

      if (cantidadCanciones >= maxFetch) {
        setAlert({
          message: "No se pueden añadir más videos, maximo alcanzado",
          type: "error",
        });
        setTimeout(() => {
          setAlert(null);
        }, 3000);
        return;
      }

      setAdded(true);
      const videoData = {
        video: {
          id: video.youtube_id,
          title: video.title,
          thumbnail: video.thumbnail,
          duration: video.duration,
          url: video.url,
        },
        mesa_id: idMesa,
        user_id: user?.id,
        empresa_id: empresaId,
      };

      await api.put(`playlist/update/${idMesa}/`, videoData);
      setAlert({ message: "Video añadido correctamente", type: "success" });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    } catch (error) {
      console.error("Error al añadir el video:", error);
      setAlert({ message: "Error al añadir el video", type: "error" });
      setTimeout(() => {
        setAlert(null);
      }, 3000);
    }
  };

  const handleDelete = async () => {
    try {
      const videoId = video.youtube_id;
      const userId = user?.id;

      await api.delete(`playlist/delete/${videoId}/${userId}/`);
      setAdded(false);
    } catch (error) {
      console.error("Error al eliminar el video:", error);
    }
  };

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <li
        key={video.youtube_id}
        className="flex items-center p-4 bg-white rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
      >
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center w-full"
        >
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-32 h-24 rounded-md mr-4 object-cover"
          />
          <div className="flex items-start flex-col flex-1">
            <span className="font-medium text-gray-700 block text-left">
              {video.title}
            </span>
            <span className="text-gray-500 text-sm text-left">
              {video.duration}
            </span>
            {env !== "search" && (
              <div className="text-black text-sm text-left">
                {video.user_name}, mesa {video.table_id}
              </div>
            )}
          </div>
        </a>

        {(env === "personal" || env === "search") &&
          (added ? (
            <FaTrash
              className="text-red-500 cursor-pointer"
              onClick={handleDelete}
              size={25}
            />
          ) : (
            <IoIosAddCircle
              className="text-green-500 cursor-pointer"
              onClick={addVideo}
              size={25}
            />
          ))}
      </li>
    </>
  );
};
