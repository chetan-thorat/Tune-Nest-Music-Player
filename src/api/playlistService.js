const API_BASE_URL = 'http://localhost:5184/api';

class PlaylistService {
    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // Get current user's playlists
    async getMyPlaylists() {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/my-playlists`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching playlists:', error);
            throw error;
        }
    }

    // Get a specific playlist by ID
    async getPlaylist(playlistId) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching playlist:', error);
            throw error;
        }
    }

    // Create a new playlist
    async createPlaylist(playlistData) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(playlistData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error creating playlist:', error);
            throw error;
        }
    }

    // Update a playlist
    async updatePlaylist(playlistId, updateData) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error updating playlist:', error);
            throw error;
        }
    }

    // Delete a playlist
    async deletePlaylist(playlistId) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error deleting playlist:', error);
            throw error;
        }
    }

    // Add a song to a playlist
    async addSongToPlaylist(playlistId, songData) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}/songs`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(songData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error adding song to playlist:', error);
            throw error;
        }
    }

    // Remove a song from a playlist
    async removeSongFromPlaylist(playlistId, songId) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}/songs/${songId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error removing song from playlist:', error);
            throw error;
        }
    }

    // Reorder songs in a playlist
    async reorderSong(playlistId, songId, newOrder) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/${playlistId}/songs/${songId}/reorder`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({ newOrder })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return true;
        } catch (error) {
            console.error('Error reordering song:', error);
            throw error;
        }
    }

    // Search playlists by name
    async searchPlaylists(query) {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error searching playlists:', error);
            throw error;
        }
    }

    // Get all public playlists (no auth required)
    async getPublicPlaylists() {
        try {
            const response = await fetch(`${this.baseUrl}/playlist/public`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching public playlists:', error);
            throw error;
        }
    }

    // Helper method to add song to playlist with song data
    async addSongToPlaylistFromSong(playlistId, song) {
        const songData = {
            songId: song.id || song._id,
            title: song.title || song.name,
            artist: song.artist,
            url: song.url,
            cover: song.cover,
            genre: song.genre
        };

        return await this.addSongToPlaylist(playlistId, songData);
    }

    // Helper method to create a default playlist
    async createDefaultPlaylist(email, playlistName = 'My Favorites') {
        const playlistData = {
            name: playlistName,
            description: 'My favorite songs',
            isPublic: false
        };

        return await this.createPlaylist(playlistData);
    }
}

// Create and export a singleton instance
const playlistService = new PlaylistService();
export default playlistService;
