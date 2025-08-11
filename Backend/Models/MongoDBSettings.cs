namespace TuneNext01.Models
{
    public class MongoDBSettings
    {
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
        public string SongsCollection { get; set; }
        public string UserPlaylistsCollection { get; set; }
    }
}
