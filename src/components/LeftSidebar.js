import React, { useContext, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { ThemeContext } from '../ThemeContext';
import globeIcon from '../assets/globe.png';
import { Link } from 'react-router-dom';

export default function LeftSidebar() {
  const {
    colors,
    isLoggedIn,
    playlists,
    createPlaylist,
    setPlaylists
  } = useContext(ThemeContext);

  const [showModal, setShowModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = () => {
    const token = localStorage.getItem('token');
    if (!token) return; // require login token
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const trimmedName = newPlaylistName.trim();
    if (!trimmedName) return;

    const newPlaylist = createPlaylist(trimmedName);
    if (!newPlaylist) return;

    setNewPlaylistName('');
    setShowModal(false);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      console.error("Missing token or email");
      return;
    }

    const updatedPlaylists = [...playlists, newPlaylist];
    const payload = {
      email,
      playlists: updatedPlaylists.map(pl => ({
        name: pl.name,
        songIds: (pl.songs || []).map(s => s.id).filter(Boolean)
      }))
    };

    console.log("Saving to backend:", payload);

    try {
      const res = await fetch('http://localhost:5184/api/UserPlaylist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      console.log("Playlist saved to backend.");
      // reflect in UI immediately and persist per-user key
      setPlaylists(updatedPlaylists);
      const key = `playlists:${email.toLowerCase()}`;
      localStorage.setItem(key, JSON.stringify(updatedPlaylists));
      localStorage.setItem('email', email);
    } catch (err) {
      console.error("Backend save error:", err);
    }
  };

  const handleDelete = async (id) => {
    const updated = playlists.filter(pl => pl.id !== id);
    setPlaylists(updated);
    try {
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (!token || !email) return;
      const payload = {
        email,
        playlists: updated.map(pl => ({ name: pl.name, songIds: (pl.songs || []).map(s => s.id).filter(Boolean) }))
      };
      await fetch('http://localhost:5184/api/UserPlaylist', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Failed to persist deletion:', e);
    }
  };

  return (
    <SidebarWrapper colors={colors}>
      <TopSection>
        <HeaderRow>
          <LibraryTitle>Your Library</LibraryTitle>
          <AddButton colors={colors} onClick={handleCreatePlaylist}>+</AddButton>
        </HeaderRow>

        {playlists.length === 0 && (
          <>
            <Section colors={colors}>
              <SectionHeading>Create your first playlist</SectionHeading>
              <SectionSubtext colors={colors}>It's easy, we'll help you</SectionSubtext>
              <CTAButton colors={colors} onClick={handleCreatePlaylist}>Create playlist</CTAButton>
            </Section>

            <Section colors={colors}>
              <SectionHeading>Let's find some podcasts to follow</SectionHeading>
              <SectionSubtext colors={colors}>We'll keep you updated on new episodes</SectionSubtext>
              <CTAButton colors={colors} onClick={handleCreatePlaylist}>Browse podcasts</CTAButton>
            </Section>
          </>
        )}

        <PlaylistList>
          {playlists.map((pl) => (
            <StyledPlaylistLink
              to={`/home/playlist/${pl.id}`}
              state={{ name: pl.name }}
              key={pl.id}
              colors={colors}
            >
              <PlaylistName>{pl.name}</PlaylistName>
              <DeleteButton
                colors={colors}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(pl.id);
                }}
              >
                ×
              </DeleteButton>
            </StyledPlaylistLink>
          ))}
        </PlaylistList>
      </TopSection>

      <BottomSection>
        <LinkGrid>
          <StyledLink to="/legal" colors={colors}>Legal</StyledLink>
          <StyledLink to="/safety-privacy" colors={colors}>Safety & Privacy Center</StyledLink>
          <StyledLink to="/privacy-policy" colors={colors}>Privacy Policy</StyledLink>
          <StyledLink to="/cookies" colors={colors}>Cookies</StyledLink>
          <StyledLink to="/privacy-policy" colors={colors}>About Ads</StyledLink>
        </LinkGrid>

        <LanguageButton colors={colors}>
          <img src={globeIcon} alt="Globe" />
          English
        </LanguageButton>
      </BottomSection>

      {showModal && (
        <ModalOverlay>
          <ModalBox colors={colors}>
            <ModalTitle colors={colors}>Name your playlist</ModalTitle>
            <ModalInput
              colors={colors}
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
            <ModalActions>
              <ModalButton colors={colors} onClick={handleSubmit}>Create</ModalButton>
              <ModalCancel colors={colors} onClick={() => setShowModal(false)}>Cancel</ModalCancel>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}
    </SidebarWrapper>
  );
}
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SidebarWrapper = styled.div`
  width: 350px;
  background: ${({ colors }) => colors.footer};
  color: ${({ colors }) => colors.text};
  padding: 2rem;
  box-sizing: border-box;
  overflow-y: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;

  @media (max-width: 768px) {
    width: 100%;
    padding: 1.5rem;
    height: auto;
  }
`;

const TopSection = styled.div``;
const BottomSection = styled.div`margin-top: auto; padding-bottom: 3rem;`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const LibraryTitle = styled.h4`font-size: 1rem; margin: 0;`;

const AddButton = styled.button`
  background: none;
  border: none;
  color: ${({ colors }) => colors.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;

  &:hover {
    background-color: ${({ colors }) => colors.hoverBackground || 'rgba(255,255,255,0.1)'};
  }
`;

const Section = styled.div`margin-bottom: 2rem; animation: ${fadeIn} 0.4s ease;`;
const SectionHeading = styled.h4`font-size: 1rem; margin-bottom: 0.3rem;`;

const SectionSubtext = styled.p`
  font-size: 0.85rem;
  margin-bottom: 0.8rem;
  color: ${({ colors }) => colors.subtext || '#b3b3b3'};
`;

const CTAButton = styled.button`
  background: white;
  color: black;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  border: none;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ colors }) => colors.hoverBackground || '#e0e0e0'};
  }
`;

const PlaylistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  animation: ${fadeIn} 0.4s ease;
`;

const StyledPlaylistLink = styled(Link)`
  background: ${({ colors }) => colors.cardBackground || '#333'};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${({ colors }) => colors.text};
  text-decoration: none;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
`;

const PlaylistName = styled.span`
  font-weight: 500;
  font-size: 0.95rem;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ colors }) => colors.text};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0 0.5rem;
  transition: color 0.3s ease;

  &:hover {
    color: red;
  }
`;

const LinkGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1rem;
`;

const StyledLink = styled(Link)`
  color: ${({ colors }) => colors.text};
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.3s ease;

  &:hover {
    text-decoration: underline;
    color: ${({ colors }) => colors.hoverText || '#ffffff'};
  }
`;

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border: 1px solid ${({ colors }) => colors.text};
  border-radius: 999px;
  background: none;
  color: ${({ colors }) => colors.text};
  padding: 0.4rem 0.8rem;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: background 0.3s ease;

  img {
    width: 18px;
    height: 18px;
  }

    &:hover {
    background-color: ${({ colors }) => colors.hoverBackground || 'rgba(255,255,255,0.1)'};
  }
`;

// 🧩 Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalBox = styled.div`
  background: ${({ colors }) => colors.background || '#222'};
  color: ${({ colors }) => colors.text};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
  animation: ${slideUp} 0.3s ease;
`;

const ModalTitle = styled.h2`
  font-size: 1.4rem;
  margin-bottom: 1rem;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid ${({ colors }) => colors.text};
  background: ${({ colors }) => colors.inputBackground || '#111'};
  color: ${({ colors }) => colors.text};
  font-size: 1rem;
  margin-bottom: 1.5rem;
  outline: none;

  &::placeholder {
    color: ${({ colors }) => colors.subtext || '#888'};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const ModalButton = styled.button`
  background: ${({ colors }) => colors.text};
  color: ${({ colors }) => colors.footer};
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: ${({ colors }) => colors.hoverText || '#fff'};
  }
`;

const ModalCancel = styled.button`
  background: transparent;
  color: ${({ colors }) => colors.text};
  border: 1px solid ${({ colors }) => colors.text};
  padding: 0.6rem 1.2rem;
  border-radius: 50px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ colors }) => colors.hoverBackground || '#444'};
  }
`;

