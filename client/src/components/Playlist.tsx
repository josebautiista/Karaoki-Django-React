import React, { useEffect, useState } from "react";
import { api } from "../config/axiosConfig";
import { FaMusic } from "react-icons/fa";

interface PlaylistProps {
  idUser?: number | null;
  idMesa?: number | null;
  empresaId: number;
}

export const Playlist: React.FC<PlaylistProps> = ({
  idUser = null,
  idMesa = null,
  empresaId,
}) => {
  const [songs, setSongs] = useState<
    { title: string; thumbnail: string; duration: string; url: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.post(`/playlist/getPlaylist/`, {
          user_id: idUser,
          table_id: idMesa,
          empresa_id: empresaId,
        });
        setSongs(response.data);
      } catch {
        setError("Error fetching playlist");
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [idUser, idMesa, empresaId]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
        <FaMusic className="mr-2 text-red-600" /> Playlist
      </h1>
      {songs.length > 0 ? (
        <ul className="space-y-4">
          {songs.map((song, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 bg-gray-500 p-4 rounded-lg shadow-sm hover:bg-gray-400 transition"
            >
              <img
                src={song.thumbnail}
                alt={song.title}
                className="w-16 h-16 rounded-lg"
              />
              <div>
                <h2 className="text-lg font-medium text-white">{song.title}</h2>
                <p className="text-sm text-gray-300">{song.duration}</p>
              </div>
              <a
                href={song.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 ml-auto hover:underline"
              >
                Ver en YouTube
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No hay canciones en la playlist.</p>
      )}
    </>
  );
};
