using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TuneNext01.Models;
using TuneNext01.Services;

namespace TuneNext01.Controllers;
//[Authorize]
[ApiController]
[Route("api/[controller]")]
public class SongController : ControllerBase
{
    private readonly SongService _songService;

    public SongController(SongService songService)
    {
        _songService = songService;
    }

    [HttpGet]
    public ActionResult<List<Song>> Get() =>
        _songService.Get();

    [HttpPost]
    public IActionResult Create(Song song)
    {
        _songService.Create(song);
        return CreatedAtAction(nameof(Get), new { id = song.Id }, song);
    }

    [HttpPut("{id:length(24)}")]
    public IActionResult Update(string id, Song updatedSong)
    {
        var existingSong = _songService.Get(id);
        if (existingSong == null)
        {
            return NotFound();
        }

        _songService.Update(id, updatedSong);
        return NoContent();
    }


    [HttpDelete("{id:length(24)}")]
    public IActionResult Delete(string id)
    {
        var song = _songService.Get(id);

        if (song == null)
        {
            return NotFound();
        }

        _songService.Remove(id);
        return NoContent();
    }
}