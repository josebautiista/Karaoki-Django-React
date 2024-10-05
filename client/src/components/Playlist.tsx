import React, { useEffect, useState } from "react";
import { api } from "../config/axiosConfig";
import { FaMusic } from "react-icons/fa";
import { CardVideo } from "../atoms/CardVideo";
import { Video } from "../Types/VideoResponse";

interface PlaylistProps {
  idUser?: number | null;
  idMesa?: number | null;
  empresaId: number;
  env: string;
}

export const Playlist: React.FC<PlaylistProps> = ({
  idUser = null,
  idMesa = null,
  empresaId,
  env,
}) => {
  const [songs, setSongs] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await api.post(`/playlist/getPlaylist/`, {
          user_id: idUser,
          table_id: idMesa,
          empresa_id: empresaId,
        });
        setSongs(response.data);
      } catch (error) {
        console.log(error);
        setSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, [idUser, idMesa, empresaId]);

  if (loading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-red-600 mb-4 flex items-center">
        <FaMusic className="mr-2 text-red-600" /> Playlist
      </h1>
      {songs.length > 0 ? (
        <ul className="space-y-4">
          {songs.map((song, index) => (
            <CardVideo key={index} video={song} env={env} />
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No hay canciones en la playlist.</p>
      )}
    </>
  );
};
