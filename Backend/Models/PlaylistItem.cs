using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TuneNext01.Models
{
    public class PlaylistItem
    {
        [BsonElement("songId")]
        [Required]
        public string SongId { get; set; }

        [BsonElement("title")]
        [Required]
        public string Title { get; set; }

        [BsonElement("artist")]
        [Required]
        public string Artist { get; set; }

        [BsonElement("url")]
        [Required]
        public string Url { get; set; }

        [BsonElement("cover")]
        public string Cover { get; set; }

        [BsonElement("genre")]
        public string? Genre { get; set; }

        [BsonElement("addedAt")]
        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        [BsonElement("order")]
        public int Order { get; set; }
    }
}
