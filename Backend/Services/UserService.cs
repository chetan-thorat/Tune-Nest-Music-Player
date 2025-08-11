using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TuneNext01.Models;

namespace TuneNext01.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var db = client.GetDatabase(settings.Value.DatabaseName);
            _users = db.GetCollection<User>("Users");
        }

        public async Task<User> GetUserByEmailAsync(string email) =>
            await _users.Find(u => u.Email == email).FirstOrDefaultAsync();

        public async Task CreateUserAsync(User user) =>
            await _users.InsertOneAsync(user);
    }

}
