import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeContext';
import {
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaRandom,
  FaHeart,
  FaRedo,
  FaVolumeUp
} from 'react-icons/fa';

const MusicBar = () => {
  const {
    currentSong,
    setCurrentSong,
    isPlaying,
    setIsPlaying,
    showMusicBar,
    setShowMusicBar,
    songs = []
  } = useTheme();

  const hideTimerRef = useRef(null);
  const intervalRef = useRef(null);
  const audioRef = useRef(null);
  const lastClickTimeRef = useRef(0);

  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!isPlaying && showMusicBar) {
      hideTimerRef.current = setTimeout(() => {
        setShowMusicBar(false);
      }, 5 * 60 * 1000);
    } else {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    }
  }, [isPlaying, showMusicBar]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {});
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          setProgress(audioRef.current.currentTime);
        }
      }, 500);
    } else {
      audioRef.current?.pause();
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  useEffect(() => {
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentSong]);

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    setProgress(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };

  const playSongAtIndex = (index) => {
    if (index >= 0 && index < songs.length) {
      setCurrentSong(songs[index]);
      setTimeout(() => setIsPlaying(true), 0);
    }
  };

  const handlePrev = () => {
    const now = Date.now();
    const lastClick = lastClickTimeRef.current;

    if (now - lastClick < 2500) {
      if (!songs.length || !currentSong) return;
      const index = songs.findIndex(s => s.url === currentSong.url);
      const prevIndex = (index - 1 + songs.length) % songs.length;
      playSongAtIndex(prevIndex);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    }

    lastClickTimeRef.current = now;
  };

  const handleNext = () => {
    if (!songs.length || !currentSong) return;

    let nextIndex;
    const currentIndex = songs.findIndex(s => s.url === currentSong.url);

    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentIndex && songs.length > 1);
    } else {
      nextIndex = (currentIndex + 1) % songs.length;
    }

    playSongAtIndex(nextIndex);
  };

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (!showMusicBar || !currentSong) return null;

  return (
    <Bar>
      <audio
        ref={audioRef}
        src={currentSong.url}
        onEnded={() => {
          if (repeat) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          } else {
            handleNext();
          }
        }}
        volume={volume}
      />

      <Left>
        <Cover src={currentSong.cover} alt={currentSong.title} />
        <Info>
          <Title>{currentSong.title}</Title>
          <Artist>{currentSong.artist}</Artist>
        </Info>
      </Left>

      <Center>
        <ControlRow>
          <Icon active={shuffle} onClick={() => setShuffle(!shuffle)}><FaRandom /></Icon>
          <Icon onClick={handlePrev}><FaStepBackward /></Icon>
          <Icon onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </Icon>
          <Icon onClick={handleNext}><FaStepForward /></Icon>
          <Icon active={repeat} onClick={() => setRepeat(!repeat)}><FaRedo /></Icon>
        </ControlRow>
        <SeekWrapper>
          <Time>{formatTime(progress)}</Time>
          <SeekBar
            min="0"
            max={audioRef.current?.duration || 100}
            value={progress}
            onChange={handleSeek}
            progress={progress}
            duration={audioRef.current?.duration || 100}
          />
        </SeekWrapper>
      </Center>

      <Right>
        <Icon active={liked} onClick={() => setLiked(!liked)}><FaHeart /></Icon>
        <Icon><FaVolumeUp /></Icon>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const vol = Number(e.target.value);
            setVolume(vol);
            if (audioRef.current) audioRef.current.volume = vol;
          }}
        />
      </Right>
    </Bar>
  );
};

export default MusicBar;

// Styled Components
const Bar = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  z-index: 1000;
  flex-wrap: wrap;
  box-sizing: border-box;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;
`;

const Cover = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Artist = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtext};
`;

const Center = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 2;
  min-width: 250px;
`;

const ControlRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const SeekWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
`;

const Time = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.subtext};
  min-width: 40px;
`;

const SeekBar = styled.input.attrs({ type: 'range' })`
  width: 100%;
  max-width: 360px;
  height: 4px;
  appearance: none;
  background: linear-gradient(
    to right,
    ${({ theme }) => theme.primary} ${({ progress, duration }) => (progress / duration) * 100}%,
    #000 ${({ progress, duration }) => (progress / duration) * 100}%
  );
  border-radius: 2px;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.text};
    border-radius: 50%;
  }

  &::-moz-range-thumb {
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.text};
    border-radius: 50%;
    border: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 200px;

  input[type='range'] {
    width: 80px;
    height: 4px;
      appearance: none;
    background: ${({ theme }) => theme.primary};
    border-radius: 2px;
    cursor: pointer;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 10px;
      height: 10px;
      background: ${({ theme }) => theme.text};
      border-radius: 50%;
    }

    &::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background: ${({ theme }) => theme.text};
      border-radius: 50%;
      border: none;
    }
  }
`;

const Icon = styled.div`
  cursor: pointer;
  color: ${({ active, theme }) => (active ? theme.primary : theme.text)};
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
