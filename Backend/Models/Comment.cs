using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TuneNext01.Models
{
    public class Comment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required]
        public string SongId { get; set; }

        [Required]
        public string Text { get; set; }

        public string? UserEmail { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int Likes { get; set; } = 0;

        public List<string> LikedBy { get; set; } = new List<string>();
    }
}




