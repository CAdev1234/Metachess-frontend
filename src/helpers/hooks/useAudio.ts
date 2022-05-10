import { useMemo, useEffect, useState } from "react";

const useAudio = (url: string, wrong: boolean) => {
  const audio: HTMLAudioElement = useMemo(() => new Audio(url), []);
  if (wrong) audio.volume = 0.4;
  const [playing, setPlaying] = useState<Boolean>(false);
  let id: NodeJS.Timer = null;
  const play = () => {
    if (id) clearTimeout(id);
    audio.currentTime = 0;
    setPlaying(true);
    if (wrong)
      id = setTimeout(() => {
        setPlaying(false);
      }, 1000);
  };

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    const func = () => setPlaying(false);
    audio.addEventListener("ended", func);
    return () => {
      audio.removeEventListener("ended", func);
    };
  }, []);

  return [playing, play];
};

export default useAudio;
