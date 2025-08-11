// src/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext();

// 🎨 Theme definitions
const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  header: '#f1f1f1',
  footer: '#f1f1f1',
  accent: '#000000',
  inputBackground: '#eeeeee',
  hoverBackground: '#333333',
  subtext: '#555555',
  cardBackground: '#ffffff',
  google: '#4285F4',
  apple: '#000000',
  facebook: '#3b5998',
  sidebarBackground: '#f9f9f9',
  primary: '#1db954',
  comment: '#e0e0e0',
};

const darkTheme = {
  background: '#000000',
  text: '#ffffff',
  header: '#111111',
  footer: '#111111',
  accent: '#ffffff',
  inputBackground: '#222222',
  hoverBackground: '#444444',
  subtext: '#aaaaaa',
  cardBackground: '#111111',
  google: '#4285F4',
  apple: '#ffffff',
  facebook: '#3b5998',
  sidebarBackground: '#181818',
  primary: '#1db954',
  comment: '#333333',
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('theme') || 'light');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('token');
    return !!token;
  });
  const getCurrentEmail = () => (localStorage.getItem('email') || 'Guest').toLowerCase();
  const [currentEmail, setCurrentEmail] = useState(getCurrentEmail());

  // 🎵 Music player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMusicBar, setShowMusicBar] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [songs, setSongs] = useState([]);

  // 📀 Playlist state
  const [playlists, setPlaylists] = useState(() => {
    const email = getCurrentEmail();
    const perUser = localStorage.getItem(`playlists:${email}`);
    if (perUser) return JSON.parse(perUser);
    const legacy = localStorage.getItem('playlists');
    return legacy ? JSON.parse(legacy) : [];
  });

  // 💾 Persist theme and playlists
  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  useEffect(() => {
    const email = getCurrentEmail();
    localStorage.setItem(`playlists:${email}`, JSON.stringify(playlists));
  }, [playlists]);

  // Update email (e.g., after login/logout) and load per-user playlists
  useEffect(() => {
    const onStorage = () => setCurrentEmail(getCurrentEmail());
    window.addEventListener('storage', onStorage);
    const email = getCurrentEmail();
    setCurrentEmail(email);
    
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Fetch playlists when user logs in
  useEffect(() => {
    const email = getCurrentEmail();
    if (isLoggedIn && email && email !== 'Guest') {
      fetchUserPlaylistsFromBackend(email);
    } else if (email) {
      // Fallback to localStorage
      const perUser = localStorage.getItem(`playlists:${email}`);
      if (perUser) setPlaylists(JSON.parse(perUser));
    }
  }, [isLoggedIn]);

  // 🌗 Toggle theme
  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // 🔄 Fetch user playlists from backend
  const fetchUserPlaylistsFromBackend = async (userEmail) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const [plRes, songsRes] = await Promise.all([
        fetch(`http://localhost:5184/api/UserPlaylist/${encodeURIComponent(userEmail)}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5184/api/Song', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!plRes.ok) throw new Error(`Failed to fetch playlists: ${plRes.status}`);
      if (!songsRes.ok) throw new Error(`Failed to fetch songs: ${songsRes.status}`);

      const data = await plRes.json();
      const songs = await songsRes.json();

      const songMap = new Map(
        songs.map(s => [s.id, {
          id: s.id,
          name: s.title,
          artist: s.artist,
          url: s.url ? `http://localhost:5184${s.url}` : undefined,
          cover: s.cover ? `http://localhost:5184${s.cover}` : undefined,
          duration: s.duration || '3:00'
        }])
      );

      const hydrated = (data.playlists || []).map((pl, idx) => ({
        id: pl.id || `backend_${idx + 1}`,
        name: pl.name,
        songs: (pl.songIds || []).map(id => songMap.get(id)).filter(Boolean)
      }));

      // Update both state and localStorage
      console.log('Fetched playlists from backend:', hydrated);
      setPlaylists(hydrated);
      localStorage.setItem(`playlists:${userEmail.toLowerCase()}`, JSON.stringify(hydrated));
    } catch (error) {
      console.error('Failed to fetch playlists from backend:', error);
      // Fallback to localStorage
      const perUser = localStorage.getItem(`playlists:${userEmail.toLowerCase()}`);
      if (perUser) {
        try {
          const parsed = JSON.parse(perUser);
          if (Array.isArray(parsed)) setPlaylists(parsed);
        } catch {}
      }
    }
  };

  // ➕ Create a new playlist and return it
  const persistUserPlaylistsToBackend = async (playlistsToPersist) => {
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (!token || !email) return;
      
      console.log('Persisting playlists to backend:', playlistsToPersist);

      const payload = {
        email,
        playlists: (playlistsToPersist ?? playlists).map(pl => ({
          name: pl.name,
          userId: email,
          songIds: (pl.songs || []).map(s => s.id).filter(Boolean)
        }))
      };
      
      console.log('Sending payload to backend:', payload);

      // Always persist to localStorage per user
      localStorage.setItem(`playlists:${email.toLowerCase()}`,
        JSON.stringify(playlistsToPersist ?? playlists));

      const response = await fetch('http://localhost:5184/api/UserPlaylist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }
      
      console.log('Successfully persisted playlists to backend');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to persist playlists:', error);
    }
  };

  const createPlaylist = (name) => {
    if (!name || playlists.some(p => p.name === name)) return null;
    const newPlaylist = { id: Date.now().toString(), name, songs: [] };
    const next = [...playlists, newPlaylist];
    console.log('Creating new playlist:', newPlaylist);
    console.log('Updated playlists array:', next);
    setPlaylists(next);
    // fire and forget
    persistUserPlaylistsToBackend(next);
    return newPlaylist;
  };

  // 🎶 Add song to a playlist
  const addSongToPlaylist = (playlistId, song) => {
    const next = playlists.map(pl =>
      pl.id === playlistId
        ? {
            ...pl,
            songs: pl.songs.some(s => (s.id && song.id ? s.id === song.id : (s.name === song.name && s.artist === song.artist)))
              ? pl.songs
              : [...pl.songs, song]
          }
        : pl
    );
    setPlaylists(next);
    persistUserPlaylistsToBackend(next);
  };

  // ❌ Remove song from a playlist
  const removeSongFromPlaylist = (playlistId, songName) => {
    const next = playlists.map(pl =>
      pl.id === playlistId
        ? {
            ...pl,
            songs: pl.songs.filter(s => s.name !== songName)
          }
        : pl
    );
    setPlaylists(next);
    persistUserPlaylistsToBackend(next);
  };

  // 🔍 Get playlist by ID
  const getPlaylistById = (id) => playlists.find(pl => pl.id === id);

  const themeTokens = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider
              value={{
          mode,
          toggleTheme,
          colors: themeTokens,
          isLoggedIn,
          setIsLoggedIn,
          playlists,
          setPlaylists,
          createPlaylist,
          addSongToPlaylist,
          removeSongFromPlaylist,
          getPlaylistById,
          fetchUserPlaylistsFromBackend,
          isPlaying,
          setIsPlaying,
          showMusicBar,
          setShowMusicBar,
          currentSong,
          setCurrentSong,
          songs,
          setSongs
        }}
    >
      <StyledThemeProvider theme={themeTokens}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export { ThemeContext };
