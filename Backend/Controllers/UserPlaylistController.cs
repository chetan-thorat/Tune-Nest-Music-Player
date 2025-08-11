using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneNext01.Models;
using TuneNext01.Services;
using System.Security.Claims;

namespace TuneNext01.Controllers;

//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UserPlaylistController : ControllerBase
{
    private readonly UserPlaylistService _service;

    public UserPlaylistController(UserPlaylistService service)
    {
        _service = service;
    }

    [HttpGet("{email}")]
    public ActionResult<UserPlaylist> GetByEmail(string email)
    {
        var result = _service.GetByEmail(email);
        if (result == null) return NotFound("No playlist found for this email.");
        return Ok(result);
    }

    [HttpPost]
    public IActionResult SaveOrUpdate(UserPlaylist playlist)
    {
        var claimEmail = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
        if (!string.IsNullOrWhiteSpace(claimEmail))
        {
            playlist.Email = claimEmail;
        }

        if (string.IsNullOrEmpty(playlist.Email))
            return BadRequest("Email is required.");

        _service.SaveOrUpdate(playlist);
        return Ok("Playlist saved successfully.");
    }

    [HttpDelete("{email}")]
    public IActionResult Delete(string email)
    {
        _service.DeleteByEmail(email);
        return NoContent();
    }
}