import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPlus, FaMinus, FaArrowLeft, FaCommentDots } from 'react-icons/fa';
import { ThemeContext } from '../ThemeContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

const PlaylistView = () => {
  const {
    colors,
    setIsPlaying,
    setShowMusicBar,
    setCurrentSong,
    playlists,
    addSongToPlaylist,
    removeSongFromPlaylist,
    getPlaylistById,
    songs: globalSongs,
    setSongs: setGlobalSongs
  } = useContext(ThemeContext);

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const from = location.state?.from || '/';

  const playlistId = isNaN(Number(id)) ? id : id.toString();
  const currentPlaylist = getPlaylistById(playlistId);
  const locationState = location.state || {};
  const playlistName = currentPlaylist?.name || locationState.name || `Playlist ${playlistId}`;
  const playlistSongs = currentPlaylist?.songs || locationState.songs || [];

  const [allSongs, setAllSongs] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [commentsBySong, setCommentsBySong] = useState({});
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedSongForComments, setSelectedSongForComments] = useState(null);

  const deriveSongKey = (song) => {
    if (song?.id) {
      return song.id;
    }
    const fallback = (globalSongs || []).find(gs => gs.name === song?.name && gs.artist === song?.artist);
    if (fallback?.id) {
      return fallback.id;
    }
    try {
      const key = btoa(`${song?.name || ''}|${song?.artist || ''}`);
      return key;
    } catch (error) {
      const fallbackKey = `${song?.name || ''}|${song?.artist || ''}`;
      return fallbackKey;
    }
  };

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5184/api/Song', {
          headers: token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : {}
        });
        const data = await res.json();
        const formatted = data.map(s => ({
          id: s.id,
          name: s.title,
          artist: s.artist,
          duration: s.duration || '3:00',
          url: s.url ? `http://localhost:5184${s.url}` : undefined,
          cover: s.cover ? `http://localhost:5184${s.cover}` : undefined
        }));
        setAllSongs(formatted);
        setGlobalSongs(formatted);
      } catch (err) {
        console.error('Failed to fetch songs:', err);
      }
    };
    fetchSongs();
  }, []);



  const openComments = async (song) => {
    const songId = deriveSongKey(song);
    setSelectedSongForComments(song);
    setShowCommentModal(true);
    try {
      const res = await fetch(`http://localhost:5184/api/Comments/song/${encodeURIComponent(songId)}`);
      if (res.ok) {
        const data = await res.json();
        setCommentsBySong(prev => ({ ...prev, [songId]: data }));
      } else {
        console.error('Failed to fetch comments:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!token || !email) {
        console.error("Cannot post comment: User not logged in or email missing.");
        return;
    }

    const songId = deriveSongKey(selectedSongForComments);

    try {
        const res = await fetch('http://localhost:5184/api/Comments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                songId: songId,
                text: commentText.trim(),
                userEmail: email
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`Failed to post comment: ${res.status} - ${errorData.message || res.statusText}`);
        }

        const postedComment = await res.json();
        setCommentsBySong(prev => ({ 
            ...prev, 
            [songId]: [postedComment, ...(prev[songId] || [])] 
        }));
        setCommentText('');
    } catch (err) {
        console.error("Error posting comment:", err);
    }
};

  const handleLikeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error("Cannot like comment: User not logged in.");
        return;
    }

    try {
        const res = await fetch(`http://localhost:5184/api/Comments/${commentId}/like`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error(`Failed to like comment: ${res.status}`);
        }

        const updatedComment = await res.json();
        // Update the comment in the commentsBySong state
        const songId = deriveSongKey(selectedSongForComments);
        setCommentsBySong(prev => ({
            ...prev,
            [songId]: prev[songId]?.map(c => c.id === commentId ? updatedComment : c) || []
        }));
    } catch (err) {
        console.error("Error liking comment:", err);
    }
};

  const isCommentLikedByUser = (comment) => {
    const email = localStorage.getItem('email');
    return comment.likedBy && comment.likedBy.includes(email);
};

  const bgColors = ['#1db954', '#e22134', '#3f51b5', '#ff9800', '#009688', '#9c27b0'];
  const background = `${bgColors[playlistId % bgColors.length]}33`;

  const totalSeconds = playlistSongs.reduce((acc, song) => {
    const [min, sec] = song.duration.split(':').map(Number);
    return acc + (min * 60 + (sec || 0));
  }, 0);
  const totalMinutes = `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`;

  const track = {
    id,
    title: playlistName,
    artist: playlistSongs[0]?.artist || 'Unknown',
    year: 2025,
    duration: totalMinutes,
    image: playlistSongs[0]?.cover || '/default-cover.jpg',
    background,
    hashtag: '#Trending',
    songs: playlistSongs
  };

  const handlePlay = song => {
    setCurrentSong({
      title: song.name,
      artist: song.artist,
      cover: song.cover,
      url: song.url
    });
    setShowMusicBar(true);
    setIsPlaying(true);
  };

  const handleAddClick = song => {
    setSelectedSong(song);
    setShowSelector(true);
  };

  const handleSelectPlaylist = pl => {
    addSongToPlaylist(pl.id, selectedSong);
    setShowSelector(false);
    setSelectedSong(null);
  };

  const handleRemoveClick = song => {
    setConfirmRemove(song);
  };

  const confirmRemoveSong = () => {
    removeSongFromPlaylist(playlistId, confirmRemove.name);
    setConfirmRemove(null);
  };

  return (
    <Wrapper themeColors={colors}>
      <TopSection bg={track.background}>
        <BackArrow onClick={() => navigate(-1)}><FaArrowLeft /></BackArrow>
        <CoverImage src={track.image} alt={track.title} />
        <TrackDetails>
          <TrackTitle themeColor={colors.text}>{track.title}</TrackTitle>
          <TrackArtist themeColor={colors.subtext}>{track.artist}</TrackArtist>
          <Meta>{track.year} • {track.duration}</Meta>
        </TrackDetails>
      </TopSection>

      <Hashtag themeColor={colors.text}>{track.hashtag}</Hashtag>

      <SongList>
        {track.songs.map((s, i) => (
          <SongItem key={i}>
            <Left>
              <SongNumber>{i + 1}</SongNumber>
              <PlayCircle bg={track.background} onClick={() => handlePlay(s)}><FaPlay /></PlayCircle>
              <SongInfo>
                <SongName themeColor={colors.text}>{s.name}</SongName>
                <SongArtist themeColor={colors.subtext}>{s.artist}</SongArtist>
              </SongInfo>
            </Left>
            <ButtonRow>
              <IconButton onClick={() => handleRemoveClick(s)} title="Remove from playlist"><FaMinus /></IconButton>
              <IconButton 
                onClick={() => openComments(s)} 
                title="Comments"
              >
                <FaCommentDots />
              </IconButton>
            </ButtonRow>
          </SongItem>
        ))}
      </SongList>

      <Hashtag themeColor={colors.text}>Add More Songs</Hashtag>

      <SongList>
        {allSongs.map((s, i) => (
          <SongItem key={`all-${i}`}>
            <Left>
              <SongNumber>{i + 1}</SongNumber>
              <PlayCircle bg={track.background} onClick={() => handlePlay(s)}><FaPlay /></PlayCircle>
              <SongInfo>
                <SongName themeColor={colors.text}>{s.name}</SongName>
                <SongArtist themeColor={colors.subtext}>{s.artist}</SongArtist>
              </SongInfo>
            </Left>
            <ButtonRow>
              <IconButton onClick={() => handleAddClick(s)} title="Add to playlist"><FaPlus /></IconButton>
            </ButtonRow>
          </SongItem>
        ))}
      </SongList>

      {showSelector && (
        <Overlay>
          <Modal>
            <h3>Select Playlist</h3>
            {playlists.length ? playlists.map((pl, i) => (
              <PlaylistItem key={i} onClick={() => handleSelectPlaylist(pl)}>{pl.name}</PlaylistItem>
            )) : (<p>No playlists available.</p>)}
            <CloseButton onClick={() => setShowSelector(false)}>Cancel</CloseButton>
          </Modal>
        </Overlay>
      )}

      {confirmRemove && (
        <Overlay>
          <Modal>
            <p>Remove "{confirmRemove.name}" from this playlist?</p>
            <ButtonRow>
              <CloseButton onClick={confirmRemoveSong}>Yes</CloseButton>
              <CloseButton onClick={() => setConfirmRemove(null)}>No</CloseButton>
            </ButtonRow>
          </Modal>
        </Overlay>
      )}



      {/* Comment Modal */}
      {showCommentModal && selectedSongForComments && (
        <CommentModalOverlay>
          <CommentModal>
            <CommentModalHeader>
              <CommentModalTitle>
                Comments for "{selectedSongForComments.name}"
              </CommentModalTitle>
              <CloseCommentButton onClick={() => setShowCommentModal(false)}>
                ✕
              </CloseCommentButton>
            </CommentModalHeader>
            
            {/* Add Comment */}
            <AddCommentSection>
              <CommentTextarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                rows="3"
              />
              <PostCommentButton onClick={handleSubmitComment}>
                Post
              </PostCommentButton>
            </AddCommentSection>

            {/* Comments List */}
            <CommentsList>
              {(commentsBySong[deriveSongKey(selectedSongForComments)] || []).map((comment) => (
                <CommentItem key={comment.id}>
                  <CommentContent>
                    <CommentUser>{comment.userEmail || 'Anonymous'}</CommentUser>
                    <CommentText>{comment.text}</CommentText>
                    <CommentDate>
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </CommentDate>
                  </CommentContent>
                  <LikeButton
                    onClick={() => handleLikeComment(comment.id)}
                    $isLiked={isCommentLikedByUser(comment)}
                  >
                    <HeartIcon>❤</HeartIcon>
                    <LikeCount>{comment.likes || 0}</LikeCount>
                  </LikeButton>
                </CommentItem>
              ))}
            </CommentsList>
          </CommentModal>
        </CommentModalOverlay>
      )}
    </Wrapper>
  );
};

export default PlaylistView;



// Styled Components
export const Wrapper = styled.div`
  background: ${({ themeColors }) => themeColors.background};
  color: ${({ themeColors }) => themeColors.text};
  min-height: 100vh;
`;

export const TopSection = styled.div`
  background: ${({ bg }) => bg};
  padding: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: flex-start;
  position: relative;
`;

export const BackArrow = styled.div`
  font-size: 1.5rem;
  color: ${({ themeColor }) => themeColor};
  cursor: pointer;
  position: absolute;
  top: 1rem;
  left: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;

export const CoverImage = styled.img`
  width: 300px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 3rem;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

export const TrackDetails = styled.div`
  flex: 1;
  margin-top: 3rem;
`;

export const TrackTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: ${({ themeColor }) => themeColor};
`;

export const TrackArtist = styled.h2`
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ themeColor }) => themeColor};
`;

export const Meta = styled.div`
  font-size: 1rem;
  color: #ddd;
  margin-bottom: 1rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Hashtag = styled.div`
  margin: 2rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${({ themeColor }) => themeColor};
`;

export const SongList = styled.div`
  margin: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SongItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const SongNumber = styled.div`
  font-size: 1rem;
  font-weight: bold;
  color: ${({ theme }) => theme.text};
  width: 24px;
  text-align: center;
`;

export const PlayCircle = styled.div`
  background: ${({ bg }) => bg};
  color: ${({ iconColor }) => iconColor};
  border-radius: 50%;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

export const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SongName = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ themeColor }) => themeColor};
`;

export const SongArtist = styled.div`
  font-size: 0.9rem;
  color: ${({ themeColor }) => themeColor};
`;

export const IconButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.2rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #fff;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

export const Modal = styled.div`
  background: #222;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  color: #fff;
  text-align: center;
`;

export const PlaylistItem = styled.div`
  padding: 0.75rem;
  margin: 0.5rem 0;
  background: #333;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #444;
  }
`;

export const CloseButton = styled.button`
  background: #555;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  margin-top: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #777;
  }
`;

// Comment Modal Styled Components
export const CommentModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const CommentModal = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  color: #000000;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
`;

export const CommentModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const CommentModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: #000000;
`;

export const CloseCommentButton = styled.button`
  background: none;
  border: none;
  color: #666;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: #000000;
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const AddCommentSection = styled.div`
  margin-bottom: 1.5rem;
`;

export const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #ffffff;
  color: #000000;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
  margin-bottom: 0.75rem;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #1db954;
    box-shadow: 0 0 0 2px rgba(29, 185, 84, 0.2);
  }
`;

export const PostCommentButton = styled.button`
  background: #1db954;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #1ed760;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const CommentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const CommentItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #1db954;
`;

export const CommentContent = styled.div`
  flex: 1;
  margin-right: 1rem;
`;

export const CommentUser = styled.p`
  font-weight: 600;
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  color: #000000;
`;

export const CommentText = styled.p`
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  color: #333;
  line-height: 1.4;
`;

export const CommentDate = styled.p`
  font-size: 0.75rem;
  margin: 0;
  color: #666;
`;

export const LikeButton = styled.button`
  background: ${({ $isLiked }) => 
    $isLiked 
      ? 'rgba(220, 38, 38, 0.2)' 
      : '#f8f9fa'};
  border: 1px solid ${({ $isLiked }) => 
    $isLiked 
      ? 'rgba(220, 38, 38, 0.5)' 
      : '#ddd'};
  color: ${({ $isLiked }) => 
    $isLiked 
      ? '#dc2626' 
      : '#666'};
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 60px;
  justify-content: center;

  &:hover {
    background: ${({ $isLiked }) => 
      $isLiked 
        ? 'rgba(220, 38, 38, 0.3)' 
        : '#e9ecef'};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const HeartIcon = styled.span`
  font-size: 0.9rem;
`;

export const LikeCount = styled.span`
  font-weight: 500;
`;
