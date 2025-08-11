import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function BrowseAlbums() {
  const {
    colors = {
      text: '#fff',
      background: '#111',
      cardBackground: '#222',
      subtext: '#aaa',
    },
  } = useContext(ThemeContext) || {};
  const navigate = useNavigate();

  const [albums, setAlbums] = useState([]);

  // ✅ Fetch albums securely with token
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5184/api/Song', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch albums');

        const data = await res.json();

        // ✅ Format for display
        const formattedAlbums = data.map((album) => ({
          id: album.id, // Make sure your API returns an `id` field
          title: album.title,
          artist: album.artist,
          cover: `http://localhost:5184${album.cover}`,
        }));

        setAlbums(formattedAlbums);
      } catch (error) {
        console.error('Failed to fetch albums:', error);
      }
    };

    fetchAlbums();
  }, []);

  const handleAlbumClick = (albumId) => {
    navigate(`/browse-album/${albumId}`, { state: { from: '/browse-album' } });
  };

  return (
    <BrowseWrapper themeColors={colors}>
      <BrowseTitle themeColors={colors}>Browse Albums</BrowseTitle>
      <AlbumGrid>
        {albums.map((album) => (
          <AlbumCard
            key={album.id}
            themeColors={colors}
            onClick={() => handleAlbumClick(album.id)}
          >
            <AlbumCover src={album.cover} alt={album.title} />
            <AlbumInfo>
              <AlbumName themeColors={colors}>{album.title}</AlbumName>
              <AlbumArtist themeColors={colors}>{album.artist}</AlbumArtist>
            </AlbumInfo>
          </AlbumCard>
        ))}
      </AlbumGrid>
    </BrowseWrapper>
  );
}

// ✅ Styled Components

const BrowseWrapper = styled.div`
  padding: 2rem;
  background: ${({ themeColors }) => themeColors.background};
  min-height: 100vh;
`;

const BrowseTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${({ themeColors }) => themeColors.text};
`;

const AlbumGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1.5rem;
`;

const AlbumCard = styled.div`
  background: ${({ themeColors }) => themeColors.cardBackground};
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }
`;

const AlbumCover = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const AlbumInfo = styled.div`
  padding: 0.75rem;
`;

const AlbumName = styled.p`
  font-weight: 600;
  color: ${({ themeColors }) => themeColors.text};
`;

const AlbumArtist = styled.p`
  font-size: 0.85rem;
  color: ${({ themeColors }) => themeColors.subtext};
`;
