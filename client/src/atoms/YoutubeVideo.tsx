import { useEffect, useState } from "react";
import ReactPlayer from "react-player";

interface YoutubeVideoProps {
  url: string;
  handleVideoEnd: () => void;
}

export const YoutubeVideo: React.FC<YoutubeVideoProps> = ({
  url,
  handleVideoEnd,
}) => {
  const [playableUrl, setPlayableUrl] = useState<string>("");

  useEffect(() => {
    const id = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1];

    if (id) {
      setPlayableUrl(`https://www.youtube.com/embed/${id}`);
    }
  }, [url]);

  return (
    <div className="w-3/4 h-full">
      <ReactPlayer
        config={{
          youtube: {
            playerVars: { showinfo: 1 },
          },
        }}
        url={playableUrl}
        onEnded={handleVideoEnd}
        controls={true}
        width="100%"
        height="100%"
      />
    </div>
  );
};
