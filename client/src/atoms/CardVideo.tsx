import React, { useContext, useEffect, useState } from "react";
import { Video } from "../Types/VideoResponse";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "../config/axiosConfig";
import { AppContext, AppContextType } from "../context/AppProvider";
import { FaTrash } from "react-icons/fa";
import { Alert } from "./Alert";
import { AxiosError } from "axios";

interface CardVideoProps {
  video: Video;
  env: string;
}

export const CardVideo: React.FC<CardVideoProps> = ({ video, env }) => {
  const { idMesa, empresaId, user, maxFetch, setRevalidate } = useContext(
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
          empresa_id: empresaId ? empresaId : user?.empresa?.id,
        });
        const found = response.data.some(
          (song: Video) => song.youtube_id === video.youtube_id
        );
        setAdded(found);
      } catch {
        console.log("Error fetching playlist");
      }
    };

    fetchSongs();
  }, [empresaId, user, video]);

  const addVideo = async () => {
    const userIsValid = await validateUser();
    console.log("validateUser", userIsValid);

    if (!userIsValid) {
      setAlert({
        message:
          "Usted ha sido eliminado, para más información contáctese con el administrador",
        type: "error",
      });
      localStorage.removeItem("empresaId");
      localStorage.removeItem("idMesa");
      localStorage.removeItem("nameKaraoki");
      localStorage.removeItem("user");
      setTimeout(() => {
        setAlert(null);
        window.location.href = "/loginUser";
      }, 4000);

      return;
    }

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
      setRevalidate((x) => !x);
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

  const validateUser = async (): Promise<boolean> => {
    console.log("user", user);
    try {
      const { data } = await api.get(`user/validate/${user?.id}/`);
      console.log("data", data);
      return data.exists;
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          return false;
        }
      }
      console.error("An unexpected error occurred", error);
      return false;
    }
  };

  const handleDelete = async () => {
    try {
      const videoId = video.youtube_id;
      const userId = user?.id;

      await api.delete(`playlist/delete/${videoId}/${userId}/`);
      setAdded(false);
      setRevalidate((x) => !x);
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
