using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneNext01.Models;
using TuneNext01.Services;
using System.Security.Claims;

namespace TuneNext01.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistController : ControllerBase
    {
        private readonly PlaylistService _playlistService;

        public PlaylistController(PlaylistService playlistService)
        {
            _playlistService = playlistService;
        }

        // Get current user's playlists
        [HttpGet("my-playlists")]
        public async Task<ActionResult<UserPlaylistResponseDto>> GetMyPlaylists()
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var userPlaylists = _playlistService.GetUserPlaylists(email);
                if (userPlaylists == null)
                {
                    return Ok(new UserPlaylistResponseDto
                    {
                        Email = email,
                        Playlists = new List<PlaylistResponseDto>(),
                        TotalPlaylists = 0
                    });
                }

                var response = new UserPlaylistResponseDto
                {
                    Id = userPlaylists.Id,
                    Email = userPlaylists.Email,
                    Playlists = userPlaylists.Playlists.Select(p => new PlaylistResponseDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt,
                        IsPublic = p.IsPublic,
                        Songs = p.Songs,
                        TotalDuration = p.TotalDuration,
                        SongCount = p.SongCount
                    }).ToList(),
                    CreatedAt = userPlaylists.CreatedAt,
                    UpdatedAt = userPlaylists.UpdatedAt,
                    TotalPlaylists = userPlaylists.TotalPlaylists
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get a specific playlist by ID
        [HttpGet("{playlistId}")]
        public async Task<ActionResult<PlaylistResponseDto>> GetPlaylist(string playlistId)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var playlist = await _playlistService.GetPlaylistByIdAsync(email, playlistId);
                if (playlist == null)
                {
                    return NotFound("Playlist not found");
                }

                var response = new PlaylistResponseDto
                {
                    Id = playlist.Id,
                    Name = playlist.Name,
                    Description = playlist.Description,
                    CreatedAt = playlist.CreatedAt,
                    UpdatedAt = playlist.UpdatedAt,
                    IsPublic = playlist.IsPublic,
                    Songs = playlist.Songs,
                    TotalDuration = playlist.TotalDuration,
                    SongCount = playlist.SongCount
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Create a new playlist
        [HttpPost]
        public async Task<ActionResult<PlaylistResponseDto>> CreatePlaylist([FromBody] CreatePlaylistDto createDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var playlist = await _playlistService.CreatePlaylistAsync(email, createDto);
                if (playlist == null)
                {
                    return BadRequest("Failed to create playlist");
                }

                var response = new PlaylistResponseDto
                {
                    Id = playlist.Id,
                    Name = playlist.Name,
                    Description = playlist.Description,
                    CreatedAt = playlist.CreatedAt,
                    UpdatedAt = playlist.UpdatedAt,
                    IsPublic = playlist.IsPublic,
                    Songs = playlist.Songs,
                    TotalDuration = playlist.TotalDuration,
                    SongCount = playlist.SongCount
                };

                return CreatedAtAction(nameof(GetPlaylist), new { playlistId = playlist.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Update a playlist
        [HttpPut("{playlistId}")]
        public async Task<ActionResult> UpdatePlaylist(string playlistId, [FromBody] UpdatePlaylistDto updateDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var success = await _playlistService.UpdatePlaylistAsync(email, playlistId, updateDto);
                if (!success)
                {
                    return NotFound("Playlist not found or update failed");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Delete a playlist
        [HttpDelete("{playlistId}")]
        public async Task<ActionResult> DeletePlaylist(string playlistId)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var success = await _playlistService.DeletePlaylistAsync(email, playlistId);
                if (!success)
                {
                    return NotFound("Playlist not found or delete failed");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Add a song to a playlist
        [HttpPost("{playlistId}/songs")]
        public async Task<ActionResult> AddSongToPlaylist(string playlistId, [FromBody] AddSongToPlaylistDto songDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var success = await _playlistService.AddSongToPlaylistAsync(email, playlistId, songDto);
                if (!success)
                {
                    return BadRequest("Failed to add song to playlist. Song might already exist or playlist not found.");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Remove a song from a playlist
        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<ActionResult> RemoveSongFromPlaylist(string playlistId, string songId)
        {
            try
            {
                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var success = await _playlistService.RemoveSongFromPlaylistAsync(email, playlistId, songId);
                if (!success)
                {
                    return NotFound("Song not found in playlist or remove failed");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Reorder songs in a playlist
        [HttpPut("{playlistId}/songs/{songId}/reorder")]
        public async Task<ActionResult> ReorderSong(string playlistId, string songId, [FromBody] ReorderPlaylistDto reorderDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var success = await _playlistService.ReorderPlaylistAsync(email, playlistId, songId, reorderDto.NewOrder);
                if (!success)
                {
                    return BadRequest("Failed to reorder song in playlist");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Search playlists by name
        [HttpGet("search")]
        public async Task<ActionResult<List<PlaylistResponseDto>>> SearchPlaylists([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                {
                    return BadRequest("Search query is required");
                }

                var email = GetUserEmail();
                if (string.IsNullOrEmpty(email))
                {
                    return Unauthorized("User email not found in token");
                }

                var playlists = await _playlistService.SearchPlaylistsAsync(email, q);
                var response = playlists.Select(p => new PlaylistResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    IsPublic = p.IsPublic,
                    Songs = p.Songs,
                    TotalDuration = p.TotalDuration,
                    SongCount = p.SongCount
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // Get all public playlists (no authentication required)
        [AllowAnonymous]
        [HttpGet("public")]
        public async Task<ActionResult<List<PlaylistResponseDto>>> GetPublicPlaylists()
        {
            try
            {
                var playlists = await _playlistService.GetPublicPlaylistsAsync();
                var response = playlists.Select(p => new PlaylistResponseDto
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    CreatedAt = p.CreatedAt,
                    UpdatedAt = p.UpdatedAt,
                    IsPublic = p.IsPublic,
                    Songs = p.Songs,
                    TotalDuration = p.TotalDuration,
                    SongCount = p.SongCount
                }).ToList();

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private string? GetUserEmail()
        {
            return User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        }
    }
}
