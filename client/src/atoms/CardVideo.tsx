import React, { useContext, useEffect, useState } from "react";
import { Video } from "../Types/VideoResponse";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "../config/axiosConfig";
import { AppContext, AppContextType } from "../context/AppProvider";
import { FaCheckCircle } from "react-icons/fa";
import { Alert } from "./Alert";

interface CardVideoProps {
  video: Video;
}

export const CardVideo: React.FC<CardVideoProps> = ({ video }) => {
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
          if (song.youtube_id === video.id) {
            setAdded(true);
          }
        });
      } catch {
        console.log("Error fetching playlist");
      }
    };

    fetchSongs();
  }, [empresaId, user, video.id]);

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
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const videoData = {
        video: {
          id: video.id,
          title: video.title,
          thumbnail: video.thumbnail,
          duration: video.duration,
          url: video.url,
        },
        mesa_id: idMesa,
        user_id: userData?.id,
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

  return (
    <>
      {alert && <Alert message={alert.message} type={alert.type} />}
      <li
        key={video.id}
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
          </div>
        </a>
        {added ? (
          <FaCheckCircle
            className="text-green-500 text-3xl w-9 h-9 cursor-pointer"
            onClick={() => setAdded(false)}
          />
        ) : (
          <IoIosAddCircle
            className="text-red-500 text-3xl w-10 h-10 cursor-pointer"
            onClick={addVideo}
          />
        )}
      </li>
    </>
  );
};
