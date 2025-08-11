using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TuneNext01.Models;
using TuneNext01.Models;

namespace TuneNext01.Services
{
    public class UserPlaylistService
    {
        private readonly IMongoCollection<UserPlaylist> _userPlaylists;

        public UserPlaylistService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _userPlaylists = database.GetCollection<UserPlaylist>("UserPlaylists");
        }

        public List<UserPlaylist> GetAll() =>
            _userPlaylists.Find(up => true).ToList();

        public UserPlaylist GetByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return null;

            var normalizedEmail = email.Trim().ToLower();

            var filter = Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail);
            return _userPlaylists.Find(filter).FirstOrDefault();
        }

        public void SaveOrUpdate(UserPlaylist incoming)
        {
            if (string.IsNullOrWhiteSpace(incoming.Email)) return;

            incoming.Email = incoming.Email.Trim().ToLower();

            var existing = GetByEmail(incoming.Email);
            if (existing != null)
            {
                incoming.Id = existing.Id;
                _userPlaylists.ReplaceOne(up => up.Id == existing.Id, incoming);
            }
            else
            {
                _userPlaylists.InsertOne(incoming);
            }
        }

        public void DeleteByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return;

            var normalizedEmail = email.Trim().ToLower();
            var filter = Builders<UserPlaylist>.Filter.Eq(up => up.Email, normalizedEmail);
            _userPlaylists.DeleteOne(filter);
        }
    }
}