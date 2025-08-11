using System.ComponentModel.DataAnnotations;

namespace TuneNext01.Models
{
    public class CreatePlaylistDto
    {
        [Required]
        [StringLength(100, MinimumLength = 1)]
        public string Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool IsPublic { get; set; } = false;
    }

    public class UpdatePlaylistDto
    {
        [StringLength(100, MinimumLength = 1)]
        public string? Name { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }

        public bool? IsPublic { get; set; }
    }

    public class AddSongToPlaylistDto
    {
        [Required]
        public string SongId { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        public string Artist { get; set; }

        [Required]
        public string Url { get; set; }

        public string? Cover { get; set; }

        public string? Genre { get; set; }
    }

    public class RemoveSongFromPlaylistDto
    {
        [Required]
        public string SongId { get; set; }
    }

    public class ReorderPlaylistDto
    {
        [Required]
        public string SongId { get; set; }

        [Required]
        [Range(0, int.MaxValue)]
        public int NewOrder { get; set; }
    }

    public class PlaylistResponseDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool IsPublic { get; set; }
        public List<PlaylistItem> Songs { get; set; }
        public int TotalDuration { get; set; }
        public int SongCount { get; set; }
    }

    public class UserPlaylistResponseDto
    {
        public string Id { get; set; }
        public string Email { get; set; }
        public List<PlaylistResponseDto> Playlists { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int TotalPlaylists { get; set; }
    }
}
