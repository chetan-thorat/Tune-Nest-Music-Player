import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import playlistService from '../api/playlistService';
import { ThemeContext } from '../context/ThemeContext';
import { FaPlus, FaMusic, FaCheck } from 'react-icons/fa';

const AddToPlaylistContainer = styled.div`
  position: relative;
`;

const AddButton = styled.button`
  background: ${props => props.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.colors.primaryHover};
    transform: scale(1.05);
  }

  &:disabled {
    background: ${props => props.colors.disabled};
    cursor: not-allowed;
    transform: none;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: ${props => props.colors.cardBackground};
  border: 1px solid ${props => props.colors.border};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  z-index: 1000;
  max-height: 300px;
  overflow-y: auto;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownTitle = styled.h4`
  margin: 0;
  color: ${props => props.colors.text};
  font-size: 1rem;
`;

const CreatePlaylistButton = styled.button`
  background: ${props => props.colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.colors.primaryHover};
  }
`;

const PlaylistList = styled.div`
  max-height: 200px;
  overflow-y: auto;
`;

const PlaylistItem = styled.div`
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.colors.hoverBackground};
  }

  &.selected {
    background: ${props => props.colors.primaryLight};
    color: ${props => props.colors.primary};
  }
`;

const PlaylistInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
`;

const PlaylistIcon = styled.div`
  color: ${props => props.colors.textSecondary};
`;

const PlaylistDetails = styled.div`
  flex: 1;
`;

const PlaylistName = styled.div`
  font-weight: 500;
  color: ${props => props.colors.text};
  font-size: 0.9rem;
`;

const PlaylistStats = styled.div`
  font-size: 0.8rem;
  color: ${props => props.colors.textSecondary};
`;

const StatusIcon = styled.div`
  color: ${props => props.colors.success};
  font-size: 0.9rem;
`;

const EmptyState = styled.div`
  padding: 1rem;
  text-align: center;
  color: ${props => props.colors.textSecondary};
  font-size: 0.9rem;
`;

const CreatePlaylistModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background: ${props => props.colors.cardBackground};
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.h3`
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
  min-height: 80px;

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
  margin-top: 1.5rem;
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

const AddToPlaylist = ({ song, onSongAdded, disabled = false }) => {
  const { colors } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });
  const [addingToPlaylist, setAddingToPlaylist] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadPlaylists();
    }
  }, [isOpen]);

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

  const handleAddToPlaylist = async (playlistId) => {
    try {
      setAddingToPlaylist(playlistId);
      await playlistService.addSongToPlaylistFromSong(playlistId, song);
      
      // Update local state
      setPlaylists(prev => prev.map(p => 
        p.id === playlistId 
          ? { ...p, songs: [...(p.songs || []), song], songCount: (p.songCount || 0) + 1 }
          : p
      ));

      if (onSongAdded) {
        onSongAdded(playlistId);
      }

      // Close dropdown after a brief delay to show success
      setTimeout(() => {
        setIsOpen(false);
        setAddingToPlaylist(null);
      }, 1000);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      setAddingToPlaylist(null);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    try {
      const newPlaylist = await playlistService.createPlaylist(createFormData);
      setPlaylists(prev => [...prev, newPlaylist]);
      setShowCreateModal(false);
      setCreateFormData({ name: '', description: '', isPublic: false });
      
      // Automatically add the song to the new playlist
      await handleAddToPlaylist(newPlaylist.id);
    } catch (error) {
      console.error('Error creating playlist:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const openCreateModal = () => {
    setShowCreateModal(true);
    closeDropdown();
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({ name: '', description: '', isPublic: false });
  };

  return (
    <AddToPlaylistContainer>
      <AddButton
        colors={colors}
        onClick={toggleDropdown}
        disabled={disabled}
        title="Add to playlist"
      >
        <FaPlus size={14} />
      </AddButton>

      {isOpen && (
        <Dropdown colors={colors}>
          <DropdownHeader colors={colors}>
            <DropdownTitle colors={colors}>Add to Playlist</DropdownTitle>
            <CreatePlaylistButton colors={colors} onClick={openCreateModal}>
              <FaPlus size={12} /> New
            </CreatePlaylistButton>
          </DropdownHeader>

          <PlaylistList>
            {loading ? (
              <PlaylistItem colors={colors}>
                <div>Loading playlists...</div>
              </PlaylistItem>
            ) : playlists.length === 0 ? (
              <EmptyState colors={colors}>
                <FaMusic size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
                <div>No playlists yet</div>
                <div>Create your first playlist!</div>
              </EmptyState>
            ) : (
              playlists.map((playlist) => (
                <PlaylistItem
                  key={playlist.id}
                  colors={colors}
                  onClick={() => handleAddToPlaylist(playlist.id)}
                  className={addingToPlaylist === playlist.id ? 'selected' : ''}
                >
                  <PlaylistInfo>
                    <PlaylistIcon colors={colors}>
                      <FaMusic size={16} />
                    </PlaylistIcon>
                    <PlaylistDetails>
                      <PlaylistName colors={colors}>{playlist.name}</PlaylistName>
                      <PlaylistStats colors={colors}>
                        {playlist.songCount || 0} songs
                      </PlaylistStats>
                    </PlaylistDetails>
                  </PlaylistInfo>
                  {addingToPlaylist === playlist.id && (
                    <StatusIcon colors={colors}>
                      <FaCheck />
                    </StatusIcon>
                  )}
                </PlaylistItem>
              ))
            )}
          </PlaylistList>
        </Dropdown>
      )}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal>
          <ModalContent colors={colors}>
            <ModalTitle colors={colors}>Create New Playlist</ModalTitle>
            <form onSubmit={handleCreatePlaylist}>
              <FormGroup>
                <Label colors={colors}>Name *</Label>
                <Input
                  colors={colors}
                  type="text"
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                  required
                  placeholder="Enter playlist name"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>Description</Label>
                <Textarea
                  colors={colors}
                  value={createFormData.description}
                  onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                  placeholder="Enter playlist description (optional)"
                />
              </FormGroup>
              <FormGroup>
                <Label colors={colors}>
                  <Checkbox
                    type="checkbox"
                    checked={createFormData.isPublic}
                    onChange={(e) => setCreateFormData({ ...createFormData, isPublic: e.target.checked })}
                  />
                  Make playlist public
                </Label>
              </FormGroup>
              <ButtonGroup>
                <Button colors={colors} className="secondary" type="button" onClick={closeCreateModal}>
                  Cancel
                </Button>
                <Button colors={colors} className="primary" type="submit">
                  Create & Add Song
                </Button>
              </ButtonGroup>
            </form>
          </ModalContent>
        </CreatePlaylistModal>
      )}
    </AddToPlaylistContainer>
  );
};

export default AddToPlaylist;
