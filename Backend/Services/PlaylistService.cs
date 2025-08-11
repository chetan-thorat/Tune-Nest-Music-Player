using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TuneNext01.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

namespace TuneNext01.Services
{
    public class PlaylistService
    {
        private readonly IMongoCollection<UserPlaylist> _userPlaylists;
        private readonly IMongoCollection<Song> _songs;

        public PlaylistService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _userPlaylists = database.GetCollection<UserPlaylist>("UserPlaylists");
            _songs = database.GetCollection<Song>("Songs");
        }

        // Get user's playlists by email
        public UserPlaylist? GetUserPlaylists(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail);
            return _userPlaylists.Find(filter).FirstOrDefault();
        }

        // Create a new playlist for a user
        public async Task<Playlist?> CreatePlaylistAsync(string email, CreatePlaylistDto createDto)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail);
            var userPlaylist = await _userPlaylists.Find(filter).FirstOrDefaultAsync();

            var newPlaylist = new Playlist
            {
                Id = ObjectId.GenerateNewId().ToString(),
                Name = createDto.Name,
                Description = createDto.Description,
                IsPublic = createDto.IsPublic,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                Songs = new List<PlaylistItem>()
            };

            if (userPlaylist == null)
            {
                // Create new user playlist document
                var newUserPlaylist = new UserPlaylist
                {
                    Email = normalizedEmail,
                    Playlists = new List<Playlist> { newPlaylist },
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                await _userPlaylists.InsertOneAsync(newUserPlaylist);
            }
            else
            {
                // Add to existing user playlist
                userPlaylist.Playlists.Add(newPlaylist);
                userPlaylist.UpdatedAt = DateTime.UtcNow;

                var update = Builders<UserPlaylist>.Update
                    .Push(up => up.Playlists, newPlaylist)
                    .Set(up => up.UpdatedAt, DateTime.UtcNow);

                await _userPlaylists.UpdateOneAsync(filter, update);
            }

            return newPlaylist;
        }

        // Update an existing playlist
        public async Task<bool> UpdatePlaylistAsync(string email, string playlistId, UpdatePlaylistDto updateDto)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId)) return false;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.Id == playlistId)
            );

            var update = Builders<UserPlaylist>.Update;
            var updateOperations = new List<UpdateDefinition<UserPlaylist>>();

            if (!string.IsNullOrWhiteSpace(updateDto.Name))
            {
                updateOperations.Add(update.Set("playlists.$.name", updateDto.Name));
            }

            if (updateDto.Description != null)
            {
                updateOperations.Add(update.Set("playlists.$.description", updateDto.Description));
            }

            if (updateDto.IsPublic.HasValue)
            {
                updateOperations.Add(update.Set("playlists.$.isPublic", updateDto.IsPublic.Value));
            }

            updateOperations.Add(update.Set("playlists.$.updatedAt", DateTime.UtcNow));
            updateOperations.Add(update.Set("updatedAt", DateTime.UtcNow));

            var combinedUpdate = update.Combine(updateOperations);
            var result = await _userPlaylists.UpdateOneAsync(filter, combinedUpdate);

            return result.ModifiedCount > 0;
        }

        // Delete a playlist
        public async Task<bool> DeletePlaylistAsync(string email, string playlistId)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId)) return false;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail);
            var update = Builders<UserPlaylist>.Update
                .PullFilter(up => up.Playlists, p => p.Id == playlistId)
                .Set(up => up.UpdatedAt, DateTime.UtcNow);

            var result = await _userPlaylists.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        // Add a song to a playlist
        public async Task<bool> AddSongToPlaylistAsync(string email, string playlistId, AddSongToPlaylistDto songDto)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId)) return false;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.Id == playlistId)
            );

            var playlist = await GetPlaylistByIdAsync(email, playlistId);
            if (playlist == null) return false;

            // Check if song already exists in playlist
            if (playlist.Songs.Any(s => s.SongId == songDto.SongId))
            {
                return false; // Song already exists
            }

            var newSong = new PlaylistItem
            {
                SongId = songDto.SongId,
                Title = songDto.Title,
                Artist = songDto.Artist,
                Url = songDto.Url,
                Cover = songDto.Cover,
                Genre = songDto.Genre,
                AddedAt = DateTime.UtcNow,
                Order = playlist.Songs.Count
            };

            var update = Builders<UserPlaylist>.Update
                .Push(up => up.Playlists[-1].Songs, newSong)
                .Set(up => up.Playlists[-1].UpdatedAt, DateTime.UtcNow)
                .Set(up => up.UpdatedAt, DateTime.UtcNow);

            var result = await _userPlaylists.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        // Remove a song from a playlist
        public async Task<bool> RemoveSongFromPlaylistAsync(string email, string playlistId, string songId)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId) || string.IsNullOrWhiteSpace(songId)) return false;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.Id == playlistId)
            );

            var update = Builders<UserPlaylist>.Update
                .PullFilter(up => up.Playlists[-1].Songs, s => s.SongId == songId)
                .Set(up => up.Playlists[-1].UpdatedAt, DateTime.UtcNow)
                .Set(up => up.UpdatedAt, DateTime.UtcNow);

            var result = await _userPlaylists.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        // Reorder songs in a playlist
        public async Task<bool> ReorderPlaylistAsync(string email, string playlistId, string songId, int newOrder)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId) || string.IsNullOrWhiteSpace(songId)) return false;

            var normalizedEmail = email.Trim().ToLower();
            var playlist = await GetPlaylistByIdAsync(email, playlistId);
            if (playlist == null) return false;

            var song = playlist.Songs.FirstOrDefault(s => s.SongId == songId);
            if (song == null) return false;

            if (newOrder < 0 || newOrder >= playlist.Songs.Count) return false;

            var oldOrder = song.Order;
            var songs = playlist.Songs.ToList();

            // Remove the song from its current position
            songs.RemoveAt(oldOrder);

            // Insert the song at the new position
            songs.Insert(newOrder, song);

            // Update order numbers for all songs
            for (int i = 0; i < songs.Count; i++)
            {
                songs[i].Order = i;
            }

            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.Id == playlistId)
            );

            var update = Builders<UserPlaylist>.Update
                .Set(up => up.Playlists[-1].Songs, songs)
                .Set(up => up.Playlists[-1].UpdatedAt, DateTime.UtcNow)
                .Set(up => up.UpdatedAt, DateTime.UtcNow);

            var result = await _userPlaylists.UpdateOneAsync(filter, update);
            return result.ModifiedCount > 0;
        }

        // Get a specific playlist by ID
        public async Task<Playlist?> GetPlaylistByIdAsync(string email, string playlistId)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(playlistId)) return null;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.Id == playlistId)
            );

            var projection = Builders<UserPlaylist>.Projection
                .Include(up => up.Playlists)
                .ElemMatch(up => up.Playlists, p => p.Id == playlistId);

            var result = await _userPlaylists.Find(filter).Project(projection).FirstOrDefaultAsync();
            if (result == null) return null;

            var playlistElement = result.GetValue("playlists").AsBsonArray.FirstOrDefault();
            return playlistElement != null ? BsonSerializer.Deserialize<Playlist>(playlistElement.AsBsonDocument) : null;
        }

        // Get all public playlists
        public async Task<List<Playlist>> GetPublicPlaylistsAsync()
        {
            var filter = Builders<UserPlaylist>.Filter.ElemMatch(up => up.Playlists, p => p.IsPublic == true);
            var projection = Builders<UserPlaylist>.Projection
                .Include(up => up.Playlists)
                .ElemMatch(up => up.Playlists, p => p.IsPublic == true);

            var results = await _userPlaylists.Find(filter).Project(projection).ToListAsync();
            var publicPlaylists = new List<Playlist>();

            foreach (var result in results)
            {
                var playlists = result.GetValue("playlists").AsBsonArray;
                foreach (var playlist in playlists)
                {
                    publicPlaylists.Add(BsonSerializer.Deserialize<Playlist>(playlist.AsBsonDocument));
                }
            }

            return publicPlaylists;
        }

        // Search playlists by name
        public async Task<List<Playlist>> SearchPlaylistsAsync(string email, string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(email)) return new List<Playlist>();

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.And(
                Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail),
                Builders<UserPlaylist>.Filter.Regex(up => up.Playlists[-1].Name, new MongoDB.Bson.BsonRegularExpression(searchTerm, "i"))
            );

            var userPlaylist = await _userPlaylists.Find(filter).FirstOrDefaultAsync();
            if (userPlaylist == null) return new List<Playlist>();

            return userPlaylist.Playlists.Where(p => 
                p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)).ToList();
        }
    }
}
