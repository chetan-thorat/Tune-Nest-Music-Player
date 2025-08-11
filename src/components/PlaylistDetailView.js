import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { useTheme } from '../ThemeContext';

const PlaylistDetailView = () => {
  const { colors } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const playlistName = location.state?.name || 'Untitled Playlist';

  const songs = [
    { name: 'Intro', duration: '2:30' },
    { name: 'Main Track', duration: '5:35' },
  ];

  const totalSeconds = songs.reduce((acc, song) => {
    const [min, sec] = song.duration.split(':').map(Number);
    return acc + min * 60 + sec;
  }, 0);
  const totalMinutes = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

  return (
    <Wrapper colors={colors}>
      <BackArrow onClick={() => navigate(-1)} colors={colors}>
        <FaArrowLeft /> Back
      </BackArrow>

      <Title>{playlistName}</Title>
      <Duration>Total Duration: {totalMinutes}</Duration>

      <SongList>
        {songs.map((song, i) => (
          <SongItem key={i} colors={colors}>
            {song.name} — {song.duration}
          </SongItem>
        ))}
      </SongList>
    </Wrapper>
  );
};

export default PlaylistDetailView;

// Styled Components
const Wrapper = styled.div`
  padding: 2rem;
  background: ${({ colors }) => colors.background};
  color: ${({ colors }) => colors.text};
  min-height: 100vh;
`;

const BackArrow = styled.button`
  background: none;
  border: none;
  color: ${({ colors }) => colors.text};
  font-size: 1rem;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Duration = styled.p`
  font-size: 1rem;
  color: ${({ colors }) => colors.subtext};
  margin-bottom: 1.5rem;
`;

const SongList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SongItem = styled.div`
  font-size: 1rem;
  padding: 0.5rem;
  background: ${({ colors }) => colors.cardBackground};
  border-radius: 8px;
`;
