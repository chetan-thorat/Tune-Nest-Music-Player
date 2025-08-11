using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TuneNext01.Models;

namespace TuneNext01.Services
{
    public class CommentService
    {
        private readonly IMongoCollection<Comment> _comments;

        public CommentService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _comments = database.GetCollection<Comment>("Comments");
        }

        public void Create(Comment comment)
        {
            _comments.InsertOne(comment);
        }

        public List<Comment> GetBySongId(string songId)
        {
            return _comments.Find(c => c.SongId == songId).ToList();
        }

        public bool LikeComment(string commentId, string userEmail)
        {
            var filter = Builders<Comment>.Filter.Eq(c => c.Id, commentId);
            var comment = _comments.Find(filter).FirstOrDefault();
            
            if (comment == null) return false;
            
            if (comment.LikedBy.Contains(userEmail))
            {
                // User already liked, unlike it
                var update = Builders<Comment>.Update
                    .Inc(c => c.Likes, -1)
                    .Pull(c => c.LikedBy, userEmail);
                var result = _comments.UpdateOne(filter, update);
                return result.ModifiedCount > 0;
            }
            else
            {
                // User hasn't liked, like it
                var update = Builders<Comment>.Update
                    .Inc(c => c.Likes, 1)
                    .Push(c => c.LikedBy, userEmail);
                var result = _comments.UpdateOne(filter, update);
                return result.ModifiedCount > 0;
            }
        }

        public Comment? GetById(string commentId)
        {
            return _comments.Find(c => c.Id == commentId).FirstOrDefault();
        }
    }
}




