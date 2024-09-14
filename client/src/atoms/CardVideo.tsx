import React from "react";
import { Video } from "../Types/VideoResponse";

interface CardVideoProps {
  video: Video;
}

export const CardVideo: React.FC<CardVideoProps> = ({ video }) => {
  const addVideo = () => {};
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
        <button
          onClick={addVideo}
          className="ml-4 bg-green-500 text-white text-3xl py-1 px-2 rounded hover:bg-green-600 transition duration-200"
        >
          +
        </button>
      </a>
    </li>
  );
};
