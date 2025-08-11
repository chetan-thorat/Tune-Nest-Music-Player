import React, { createContext, useState } from "react";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <PlayerContext.Provider value={{ currentTrack, setCurrentTrack, isPlaying, setIsPlaying }}>
      {children}
    </PlayerContext.Provider>
  );
};
