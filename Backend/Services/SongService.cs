namespace TuneNext01.Services;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System;
using System.Threading.Tasks;
using TuneNext01.Models;

public class SongService
{
    private readonly IMongoCollection<Song> _songs;

    public SongService(IOptions<MongoDBSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _songs = database.GetCollection<Song>(settings.Value.SongsCollection);
    }


    public List<Song> Get() => 
        _songs.Find(song => true).ToList();

    public Song Get(string id) => 
        _songs.Find(song => song.Id == id).FirstOrDefault();
    public void Create(Song song) => 
        _songs.InsertOne(song);

    public void Update(string id, Song updatedSong)
    {
        updatedSong.Id = id; // Ensures data integrity
        _songs.ReplaceOne(song => song.Id == id, updatedSong);
    }

    public void Remove(string id) =>
        _songs.DeleteOne(song => song.Id == id);

    public async Task<Song> GetByIdAsync(string id)
    {
        return await _songs.Find(song => song.Id == id).FirstOrDefaultAsync();
    }
}
