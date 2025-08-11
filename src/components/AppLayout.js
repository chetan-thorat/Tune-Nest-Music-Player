import React, { useContext, useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaMusic } from 'react-icons/fa';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { ThemeContext } from '../ThemeContext';
import Header from './Header';
import Footer from './footer';
import LeftSidebar from './LeftSidebar';
import BrowseAlbums from './BrowseAlbums';
import MusicBar from '../pages/MusicBar';
import { jwtDecode } from 'jwt-decode';

const Section = ({ title, items, themeColors, circular, onItemClick }) => {
  const scrollRef = useRef(null);
  const navigate = useLocation();

  const handleCardClick = (index) => {
    if (onItemClick) {
      onItemClick(index, items[index]);
    } else {
      window.location.href = `/home/track/${index + 1}`;
    }
  };

  return (
    <SectionWrapper>
      <StickyHeader colors={themeColors}>
        <SectionTitle colors={themeColors}>{title}</SectionTitle>
      </StickyHeader>

      <ScrollContainer>
        <ScrollRow ref={scrollRef} colors={themeColors}>
          {items.map((item, index) => (
            <Card
              key={index}
              colors={themeColors}
              $circular={circular}
              onClick={() => handleCardClick(index)}
            >
              <Image src={item.image} alt={item.name} $circular={circular} />
              <Name colors={themeColors}>{item.name}</Name>
              <Artist colors={themeColors}>{item.artist}</Artist>
              <MusicIcon colors={themeColors} className="music-icon">
                <FaMusic />
              </MusicIcon>
            </Card>
          ))}
        </ScrollRow>
      </ScrollContainer>
    </SectionWrapper>
  );
};

export default function AppLayout() {
  const { colors, showMusicBar, setPlaylists, setSongs, playlists, songs, setCurrentSong, setIsPlaying, setShowMusicBar } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [headerHeight, setHeaderHeight] = useState(72);
  const [activeSection, setActiveSection] = useState('home');
  const [trendingTracks, setTrendingTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('Guest');
  const headerRef = useRef(null);
  const scrollAreaRef = useRef(null);
  const location = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  // Load any per-user playlists from localStorage immediately on mount
  useEffect(() => {
    try {
      const storedEmail = (localStorage.getItem('email') || '').toLowerCase();
      if (storedEmail) {
        const key = `playlists:${storedEmail}`;
        const local = localStorage.getItem(key);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) setPlaylists(parsed);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loginSuccess = localStorage.getItem('loginSuccess');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const decodedEmail = decoded?.email || localStorage.getItem('email');
        if (decodedEmail) {
          setEmail(decodedEmail);
          // Load per-user playlists from localStorage immediately on login
          const key = `playlists:${decodedEmail.toLowerCase()}`;
          const local = localStorage.getItem(key);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) setPlaylists(parsed);
            } catch {}
          }
        }
      } catch (err) {
        console.error('Invalid token:', err);
        const fallbackEmail = localStorage.getItem('email');
        if (fallbackEmail) {
          setEmail(fallbackEmail);
          const key = `playlists:${fallbackEmail.toLowerCase()}`;
          const local = localStorage.getItem(key);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) setPlaylists(parsed);
            } catch {}
          }
        }
      }
    }

    if (loginSuccess === 'true') {
      setShowSuccess(true);
      localStorage.removeItem('loginSuccess');

      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    }
  }, []);

  // ✅ Fetch songs (also cache full song objects with ids)
  useEffect(() => {
    const fetchSongs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5184/api/Song', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const fullSongs = data.map(song => ({
          id: song.id,
          name: song.title,
          artist: song.artist,
          url: song.url ? `http://localhost:5184${song.url}` : undefined,
          cover: song.cover ? `http://localhost:5184${song.cover}` : undefined,
          image: song.cover ? `http://localhost:5184${song.cover}` : '/default-cover.jpg',
          duration: song.duration || '3:00',
          genre: song.genre || undefined
        }));

        setTrendingTracks(fullSongs.map(({ image, name, artist }) => ({ image, name, artist })));
        setSongs(fullSongs);
      } catch (err) {
        console.error('Fetch failed:', err);
      }
    };

    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (token) {
        clearInterval(tokenCheckInterval);
        fetchSongs();
      }
    }, 100);

    return () => clearInterval(tokenCheckInterval);
  }, []);

  // ✅ Fetch user playlists and rehydrate songs from songIds (fallback to localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    const fetchUserPlaylists = async () => {
      try {
        const [plRes, songsRes] = await Promise.all([
          fetch(`http://localhost:5184/api/UserPlaylist/${encodeURIComponent(email)}`, {
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
          id: pl.id || (idx + 1).toString(),
          name: pl.name,
          songs: (pl.songIds || []).map(id => songMap.get(id)).filter(Boolean)
        }));

        const perUserKey = `playlists:${email.toLowerCase()}`;
        localStorage.setItem(perUserKey, JSON.stringify(hydrated));
        setPlaylists(hydrated);
        console.log('Fetched playlists (hydrated):', hydrated);
      } catch (err) {
        console.error("Playlist fetch error:", err);
        // Fallback to per-user localStorage
        if (email) {
          const key = `playlists:${email.toLowerCase()}`;
          const local = localStorage.getItem(key);
          if (local) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed)) setPlaylists(parsed);
            } catch {}
          }
        }
      }
    };

    if (token && email && email !== 'Guest') {
      fetchUserPlaylists();
    }
  }, [email]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      const height = Math.min(Math.max(entry.contentRect.height, 50), 72);
      setHeaderHeight(height);
    });
    if (headerRef.current) observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const path = location.pathname || '';
    if (path === '/home') {
      setActiveSection('home');
    } else if (path === '/home/browse-album') {
      setActiveSection('browse');
    } else if (path.startsWith('/home/')) {
      setActiveSection('nested');
    } else {
      setActiveSection('home');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (activeSection === 'home' && scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeSection]);

  const normalizedQuery = (searchQuery || '').trim().toLowerCase();
  const filteredSongs = (songs || []).filter(s => {
    const inName = s.name?.toLowerCase().includes(normalizedQuery);
    const inArtist = s.artist?.toLowerCase().includes(normalizedQuery);
    const inGenre = (s.genre || '').toLowerCase().includes(normalizedQuery);
    return normalizedQuery === '' ? false : (inName || inArtist || inGenre);
  });

  const filteredTracks = (normalizedQuery
    ? filteredSongs.map(({ name, artist, cover }) => ({
        name,
        artist,
        image: cover || '/default-cover.jpg'
      }))
    : trendingTracks
  );

  const playlistResults = (playlists || []).filter(pl => {
    if (!normalizedQuery) return false;
    const inName = pl.name?.toLowerCase().includes(normalizedQuery);
    const inSongs = (pl.songs || []).some(s =>
      s.name?.toLowerCase().includes(normalizedQuery) ||
      s.artist?.toLowerCase().includes(normalizedQuery) ||
      (s.genre || '').toLowerCase().includes(normalizedQuery)
    );
    return inName || inSongs;
  });

  const artistResults = Array.from(
    new Map(
      (songs || [])
        .filter(s => normalizedQuery && s.artist?.toLowerCase().includes(normalizedQuery))
        .map(s => [s.artist, s])
    ).values()
  ).map(s => ({
    key: s.artist,
    name: s.artist,
    artist: 'Artist',
    image: s.cover || '/default-cover.jpg'
  }));

  const genreResults = Array.from(
    new Set(
      (songs || [])
        .map(s => (s.genre || '').trim())
        .filter(g => g && normalizedQuery && g.toLowerCase().includes(normalizedQuery))
    )
  ).map(g => ({ key: g, name: g, artist: 'Genre', image: '/logo.svg' }));

  const desiredGenres = [
    'disco',
    'hip hop',
    'jazz',
    'heavy metal',
    'popular music',
    'classical music',
    "90's",
    'genz music'
  ];

  const homeGenres = desiredGenres.filter(g =>
    (songs || []).some(s => (s.genre || '').trim().toLowerCase() === g)
  );

  // Fetch all songs fresh from backend and open a temporary playlist view
  const openDynamicAllSongsPlaylist = async (title, slug) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5184/api/Song', {
        headers: token
          ? {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          : {}
      });
      if (!res.ok) throw new Error(`Songs fetch failed: ${res.status}`);
      const data = await res.json();
      const full = data.map(song => ({
        id: song.id,
        name: song.title,
        artist: song.artist,
        url: song.url ? `http://localhost:5184${song.url}` : undefined,
        cover: song.cover ? `http://localhost:5184${song.cover}` : undefined,
        duration: song.duration || '3:00'
      }));
      navigate(`/home/playlist/${slug}`, { state: { name: title, songs: full } });
    } catch (e) {
      console.error('Open dynamic playlist failed:', e);
    }
  };

  const openDynamicPlaylist = (title, slug, songList) => {
    const list = (songList || []).map(s => ({
      id: s.id,
      name: s.name,
      artist: s.artist,
      url: s.url,
      cover: s.cover,
      duration: s.duration || '3:00'
    }));
    navigate(`/home/playlist/${slug}`, { state: { name: title, songs: list } });
  };

  const playSelectedSong = (index, item) => {
    if (!songs || songs.length === 0) return;
    const match = songs.find(s => s.name === item?.name && s.artist === item?.artist) || songs[index];
    if (!match) return;
    setCurrentSong({ title: match.name, artist: match.artist, cover: match.cover, url: match.url });
    setShowMusicBar(true);
    setIsPlaying(true);
  };

  return (
    <AppWrapper>
      <HeaderWrapper>
        <Header ref={headerRef} iconSpacing="1rem" onNavigate={setActiveSection} />
      </HeaderWrapper>

      <SidebarWrapper headerHeight={headerHeight}>
        <LeftSidebar headerHeight={headerHeight} />
      </SidebarWrapper>

      <MainScrollArea ref={scrollAreaRef} colors={colors} headerHeight={headerHeight}>
        <ContentWrapper>
          <WelcomeText>Welcome, {email}</WelcomeText>

          <SearchBoxWrapper>
            {showSuccess && (
              <SuccessToast>
                ✅ Logged in successfully as <strong>{email}</strong>
              </SuccessToast>
            )}

            <SearchInput
              type="text"
              placeholder="What do you want to listen?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchBoxWrapper>

          {activeSection === 'home' ? (
            <>
              {playlists && playlists.length > 0 && (
                <Section
                  title="Your Playlists"
                  items={playlists.map(pl => ({
                    id: pl.id,
                    name: pl.name,
                    artist: `${pl.songs?.length || 0} songs`,
                    image: (pl.songs && pl.songs[0]?.cover) || '/logo.svg'
                  }))}
                  themeColors={colors}
                  onItemClick={(_, item) => {
                    navigate(`/home/playlist/${item.id}`);
                  }}
                />
              )}
              {normalizedQuery ? (
                <>
                  {filteredSongs.length > 0 && (
                    <Section
                      title="Songs"
                      items={filteredTracks}
                      themeColors={colors}
                      onItemClick={() => openDynamicPlaylist('Search: Songs', 'temp-search-songs', filteredSongs)}
                    />
                  )}
                  {artistResults.length > 0 && (
                    <Section
                      title="Artists"
                      items={artistResults}
                      themeColors={colors}
                      onItemClick={(_, item) => openDynamicPlaylist(`Artist: ${item.name}`, `temp-artist-${encodeURIComponent(item.key)}`, (songs || []).filter(s => s.artist === item.key))}
                    />
                  )}
                  {genreResults.length > 0 && (
                    <Section
                      title="Genres"
                      items={genreResults}
                      themeColors={colors}
                      onItemClick={(_, item) => openDynamicPlaylist(`Genre: ${item.name}`, `temp-genre-${encodeURIComponent(item.key)}`, (songs || []).filter(s => (s.genre || '').trim() === item.key))}
                    />
                  )}
                  {playlistResults.length > 0 && (
                    <Section
                      title="Playlists"
                      items={playlistResults.map(pl => ({ id: pl.id, name: pl.name, artist: `${pl.songs?.length || 0} songs`, image: (pl.songs && pl.songs[0]?.cover) || '/logo.svg' }))}
                      themeColors={colors}
                      onItemClick={(_, item) => navigate(`/home/playlist/${item.id}`)}
                    />
                  )}
                </>
              ) : (
                <Section
                  title="Trending Songs"
                  items={trendingTracks}
                  themeColors={colors}
                  onItemClick={playSelectedSong}
                />
              )}
              {!searchQuery && trendingTracks.length === 0 && (
                <p style={{ color: colors.text }}>No songs available.</p>
              )}
              {!searchQuery && trendingTracks.length > 0 && (
                <>
                  {homeGenres.length > 0 && (
                    <Section
                      title="Genres"
                      items={homeGenres.map(g => ({ name: g, artist: 'Genre', image: '/logo.svg' }))}
                      themeColors={colors}
                      onItemClick={(_, item) => openDynamicPlaylist(`Genre: ${item.name}`, `temp-genre-${encodeURIComponent(item.name)}`, (songs || []).filter(s => (s.genre || '').trim() === item.name))}
                    />
                  )}
                  <Section title="Popular Artists" items={trendingTracks} themeColors={colors} circular onItemClick={() => openDynamicAllSongsPlaylist('Popular Artists', 'temp-popular-artists')} />
                  <Section title="Popular Albums & Singles" items={trendingTracks} themeColors={colors} onItemClick={() => openDynamicAllSongsPlaylist('Popular Albums & Singles', 'temp-popular-albums')} />
                  <Section title="Popular Radio" items={trendingTracks} themeColors={colors} onItemClick={() => openDynamicAllSongsPlaylist('Popular Radio', 'temp-popular-radio')} />
                  <Section title="Featured Charts" items={trendingTracks} themeColors={colors} onItemClick={() => openDynamicAllSongsPlaylist('Featured Charts', 'temp-featured-charts')} />
                  <Section title={"India's Best"} items={trendingTracks} themeColors={colors} onItemClick={() => openDynamicAllSongsPlaylist("India's Best", 'temp-indias-best')} />
                </>
              )}
            </>
          ) : activeSection === 'browse' ? (
            <BrowseAlbums />
          ) : (
            <Outlet />
          )}
        </ContentWrapper>

        <FooterWrapper>
          <Footer />
        </FooterWrapper>
      </MainScrollArea>

      {showMusicBar && <MusicBar />}
    </AppWrapper>
  );
}
// Styled component for welcome text


// Add this styled component
const SuccessToast = styled.div`
  background-color: #28a745;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;


const WelcomeText = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.text || '#fff'};
  margin-bottom: 1rem;
`;

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme?.colors?.background || '#111'};
  @media (min-width: 768px) {
    flex-direction: row;
    height: 100vh;
    overflow: hidden;
  }
`;

const HeaderWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
`;

const SidebarWrapper = styled.div`
  background: ${({ theme }) => theme?.colors?.sidebarBackground || '#111'};
  z-index: 99;
  padding: 1rem;
  @media (max-width: 767px) {
    position: relative;
    width: 100%;
    margin-top: ${({ headerHeight }) => `${headerHeight}px`};
  }
  @media (min-width: 768px) {
    width: 350px;
    position: fixed;
    top: ${({ headerHeight }) => `${headerHeight}px`};
    bottom: 0;
    left: 0;
    padding: 0;
  }
`;

const MainScrollArea = styled.div`
  flex: 1;
  margin-top: ${({ headerHeight }) => `${headerHeight}px`};
  background: ${({ colors }) => colors?.background};
  @media (min-width: 768px) {
    height: calc(100vh - ${({ headerHeight }) => `${headerHeight}px`});
    margin-left: 350px;
    overflow-y: auto;
  }
`;

const ContentWrapper = styled.div`
  padding: 1rem;
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
`;

const SectionWrapper = styled.div`
  margin-bottom: 3rem;
`;

const StickyHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: ${({ colors }) => colors?.background || '#000'};
  z-index: 5;
  padding: 0.5rem 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ colors }) => colors?.text};
`;

const ScrollContainer = styled.div`
  position: relative;
`;

const ScrollRow = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 1rem 0;
  scroll-snap-type: x mandatory;
  scroll-padding: 1rem;
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ colors }) => colors?.hoverBackground || '#555'};
    border-radius: 3px;
  }
`;

const Card = styled.div`
  min-width: 140px;
  cursor: pointer;
  position: relative;
  border-radius: 8px;
  background-color: ${({ colors }) => colors.cardBackground || '#1e1e1e'};
  padding: 10px;
  text-align: center;
  &:hover .music-icon {
    opacity: 1;
    transform: scale(1.2);
  }
`;

const Image = styled.img`
  width: ${({ $circular }) => ($circular ? '100px' : '140px')};
  height: ${({ $circular }) => ($circular ? '100px' : '140px')};
  border-radius: ${({ $circular }) => ($circular ? '50%' : '8px')};
  object-fit: cover;
`;

const Name = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${({ colors }) => colors?.text || '#fff'};
  margin-bottom: 0.25rem;
`;

const Artist = styled.div`
  font-size: 0.85rem;
  color: ${({ colors }) => colors?.subtext || '#aaa'};
`;

const MusicIcon = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 1.2rem;
  color: ${({ colors }) => colors?.accent || '#1db954'};
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 0.3s ease, transform 0.3s ease;
`;

const SearchBoxWrapper = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.cardBackground || '#222'};
  color: ${({ theme }) => theme.text || '#fff'};
  outline: none;
  transition: background 0.3s ease, color 0.3s ease;

  &::placeholder {
    color: ${({ theme }) => theme.subtext || '#aaa'};
    opacity: 0.6;
  }

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary || '#1db954'};
  }
`;
