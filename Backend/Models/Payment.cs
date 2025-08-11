using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.ComponentModel.DataAnnotations;

namespace TuneNext01.Models
{
    public class Payment
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Plan { get; set; }

        [Required]
        public string Price { get; set; }

        public string? Name { get; set; }

        public string? Last4 { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}




