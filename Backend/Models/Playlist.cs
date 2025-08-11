using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TuneNext01.Models
{
    public class Playlist
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [BsonElement("userId")]
        public string UserId { get; set; }

        [BsonElement("name")]
        public string Name { get; set; }

        [BsonElement("songIds")]
        public List<string> SongIds { get; set; } = new List<string>();

        [BsonElement("description")]
        public string? Description { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("isPublic")]
        public bool IsPublic { get; set; } = false;

        [BsonElement("songs")]
        public List<PlaylistItem> Songs { get; set; } = new List<PlaylistItem>();

        [BsonElement("totalDuration")]
        public int TotalDuration { get; set; } = 0;

        [BsonElement("songCount")]
        public int SongCount => Songs?.Count ?? 0;
    }
}
