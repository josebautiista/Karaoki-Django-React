import React, { useContext } from "react";
import { Video } from "../Types/VideoResponse";
import { IoIosAddCircle } from "react-icons/io";
import { api } from "../config/axiosConfig";
import { AppContext, AppContextType } from "../context/AppProvider";

interface CardVideoProps {
  video: Video;
}

export const CardVideo: React.FC<CardVideoProps> = ({ video }) => {
  const { idMesa, empresaId } = useContext(AppContext) as AppContextType;

  const addVideo = () => {
    const user = localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;
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

    api
      .put(`playlist/update/${idMesa}/`, videoData)
      .then(() => {
        alert("Video added successfully!");
      })
      .catch(() => {
        alert("Failed to add video");
      });
  };

  return (
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
      <IoIosAddCircle
        className="text-red-500 text-3xl w-10 h-10 cursor-pointer"
        onClick={addVideo}
      />
    </li>
  );
};
