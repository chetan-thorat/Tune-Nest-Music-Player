namespace TuneNext01.Models;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Song
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("title")]
    public string Title { get; set; }

    [BsonElement("artist")]
    public string Artist { get; set; }

    [BsonElement("url")]
    public string Url { get; set; }

    [BsonElement("cover")]
    public string Cover { get; set; }

    [BsonElement("genre")]
    public string? Genre { get; set; }
}
