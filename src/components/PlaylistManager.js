import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import playlistService from '../api/playlistService';
import { ThemeContext } from '../context/ThemeContext';
import { FaPlus, FaTrash, FaEdit, FaMusic, FaPlay, FaHeart, FaRegHeart } from 'react-icons/fa';

const PlaylistManagerContainer = styled.div`
  padding: 2rem;
  background: ${props => props.colors.background};
  color: ${props => props.colors.text};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${props => props.colors.primary};
`;

const CreatePlaylistButton = styled.button`
  background: ${props => props.colors.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const PlaylistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PlaylistCard = styled.div`
  background: ${props => props.colors.cardBackground};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const PlaylistHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const PlaylistInfo = styled.div`
  flex: 1;
`;

const PlaylistName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.colors.text};
  margin-bottom: 0.5rem;
`;

const PlaylistDescription = styled.p`
  color: ${props => props.colors.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PlaylistStats = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: ${props => props.colors.textSecondary};
`;

const PlaylistActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.colors.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.colors.primary};
    background: ${props => props.colors.primaryLight};
  }
`;

const SongsList = styled.div`
  margin-top: 1rem;
`;

const SongItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.colors.hoverBackground};
  }
`;

const SongCover = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
`;

const SongInfo = styled.div`
  flex: 1;
`;

const SongTitle = styled.div`
  font-weight: 500;
  color: ${props => props.colors.text};
  font-size: 0.9rem;
`;

const SongArtist = styled.div`
  color: ${props => props.colors.textSecondary};
  font-size: 0.8rem;
`;

const SongActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: ${props => props.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1.5rem;
  color: ${props => props.colors.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.colors.border};
  border-radius: 6px;
  background: ${props => props.colors.inputBackground};
  color: ${props => props.colors.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.colors.primary};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.colors.border};
  border-radius: 6px;
  background: ${props => props.colors.inputBackground};
  color: ${props => props.colors.text};
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: ${props => props.colors.primary};
  }
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: ${props => props.colors.primary};
    color: white;

    &:hover {
      background: ${props => props.colors.primaryHover};
    }
  }

  &.secondary {
    background: ${props => props.colors.secondary};
    color: ${props => props.colors.text};

    &:hover {
      background: ${props => props.colors.secondaryHover};
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.colors.textSecondary};
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  color: ${props => props.colors.primary};
`;

const PlaylistManager = () => {
  const { colors } = useContext(ThemeContext);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      const response = await playlistService.getMyPlaylists();
      setPlaylists(response.playlists || []);
    } catch (error) {
      console.error('Error loading playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      await playlistService.createPlaylist(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', isPublic: false });
      loadPlaylists();
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const handleEditPlaylist = async (e) => {
    e.preventDefault();
    try {
      await playlistService.updatePlaylist(editingPlaylist.id, formData);
      setShowEditModal(false);
      setEditingPlaylist(null);
      setFormData({ name: '', description: '', isPublic: false });
      loadPlaylists();
    } catch (error) {
      console.error('Error updating playlist:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (window.confirm('Are you sure you want to delete this playlist?')) {
      try {
        await playlistService.deletePlaylist(playlistId);
        loadPlaylists();
      } catch (error) {
        console.error('Error deleting playlist:', error);
      }
    }
  };

  const openEditModal = (playlist) => {
    setEditingPlaylist(playlist);
    setFormData({
      name: playlist.name,
      description: playlist.description || '',
      isPublic: playlist.isPublic
    });
    setShowEditModal(true);
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '', isPublic: false });
    setShowCreateModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingPlaylist(null);
    setFormData({ name: '', description: '', isPublic: false });
  };

  if (loading) {
    return (
      <PlaylistManagerContainer colors={colors}>
        <LoadingSpinner>
          <div>Loading playlists...</div>
        </LoadingSpinner>
      </PlaylistManagerContainer>
    );
  }

  return (
    <PlaylistManagerContainer colors={colors}>
      <Header>
        <Title colors={colors}>My Playlists</Title>
        <CreatePlaylistButton colors={colors} onClick={openCreateModal}>
          <FaPlus />
          Create Playlist
        </CreatePlaylistButton>
      </Header>

      {playlists.length === 0 ? (
        <EmptyState colors={colors}>
          <FaMusic size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h3>No playlists yet</h3>
          <p>Create your first playlist to start organizing your favorite songs!</p>
        </EmptyState>
      ) : (
        <PlaylistsGrid>
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} colors={colors}>
              <PlaylistHeader>
                <PlaylistInfo>
                  <PlaylistName colors={colors}>{playlist.name}</PlaylistName>
                  {playlist.description && (
                    <PlaylistDescription colors={colors}>
                      {playlist.description}
                    </PlaylistDescription>
                  )}
                  <PlaylistStats colors={colors}>
                    <span>{playlist.songCount} songs</span>
                    <span>{playlist.isPublic ? 'Public' : 'Private'}</span>
                  </PlaylistStats>
                </PlaylistInfo>
                <PlaylistActions>
                  <ActionButton
                    colors={colors}
                    onClick={() => openEditModal(playlist)}
                    title="Edit playlist"
                  >
                    <FaEdit />
                  </ActionButton>
                  <ActionButton
                    colors={colors}
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    title="Delete playlist"
                  >
                    <FaTrash />
                  </ActionButton>
                </PlaylistActions>
              </PlaylistHeader>

              {playlist.songs && playlist.songs.length > 0 && (
                <SongsList>
                  {playlist.songs.slice(0, 3).map((song, index) => (
                    <SongItem key={song.songId} colors={colors}>
                      <SongCover src={song.cover} alt={song.title} />
                      <SongInfo>
                        <SongTitle colors={colors}>{song.title}</SongTitle>
                        <SongArtist colors={colors}>{song.artist}</SongArtist>
                      </SongInfo>
                      <SongActions>
                        <ActionButton colors={colors} title="Play song">
                          <FaPlay />
                        </ActionButton>
                      </SongActions>
                    </SongItem>
                  ))}
                  {playlist.songs.length > 3 && (
                    <div style={{ textAlign: 'center', padding: '0.5rem', color: colors.textSecondary }}>
                      +{playlist.songs.length - 3} more songs
                    </div>
                  )}
                </SongsList>
              )}
            </PlaylistCard>
          ))}
        </PlaylistsGrid>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <Modal>
          <ModalContent colors={colors}>
            <ModalTitle colors={colors}>Create New Playlist</ModalTitle>
            <form onSubmit={handleCreatePlaylist}>
              <FormGroup>
                <Label colors={colors}>Name *</Label>
                <Input
                  colors={colors}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter playlist name"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>Description</Label>
                <Textarea
                  colors={colors}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter playlist description (optional)"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  Make playlist public
                </Label>
              </FormGroup>
              <ButtonGroup>
                <Button colors={colors} className="secondary" type="button" onClick={closeModals}>
                  Cancel
                </Button>
                <Button colors={colors} className="primary" type="submit">
                  Create Playlist
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Playlist Modal */}
      {showEditModal && editingPlaylist && (
        <Modal>
          <ModalContent colors={colors}>
            <ModalTitle colors={colors}>Edit Playlist</ModalTitle>
            <form onSubmit={handleEditPlaylist}>
              <FormGroup>
                <Label colors={colors}>Name *</Label>
                <Input
                  colors={colors}
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Enter playlist name"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>Description</Label>
                <Textarea
                  colors={colors}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter playlist description (optional)"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>
                  <Checkbox
                    type="checkbox"
                    checked={formData.isPublic}
                    onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  />
                  Make playlist public
                </Label>
              </FormGroup>
              <ButtonGroup>
                <Button colors={colors} className="secondary" type="button" onClick={closeModals}>
                  Cancel
                </Button>
                <Button colors={colors} className="primary" type="submit">
                  Update Playlist
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </Modal>
      )}
    </PlaylistManagerContainer>
  );
};

export default PlaylistManager;
