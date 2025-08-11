import React, { useEffect, useState } from 'react';

const SongList = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetch("https://localhost:7197/api/song") // ✅ Your actual endpoint
      .then(res => res.json())
      .then(data => setSongs(data))
      .catch(err => console.error("Failed to fetch songs:", err));
  }, []);

  return (
    <div>
      <h2>Song List</h2>
      {songs.map(song => (
        <div key={song.id}>
          <h3>{song.title} - {song.artist}</h3>
          <img
            src={`https://localhost:7197${song.cover}`}
            alt={song.title}
            width={200}
          />
          <audio controls>
            <source src={`https://localhost:7197${song.url}`} type="audio/mp3" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      ))}
    </div>
  );
};

export default SongList;
