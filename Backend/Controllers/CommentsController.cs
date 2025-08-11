using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TuneNext01.Models;
using TuneNext01.Services;

namespace TuneNext01.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly CommentService _commentService;

        public CommentsController(CommentService commentService)
        {
            _commentService = commentService;
        }

        [HttpPost]
        public IActionResult Create(Comment comment)
        {
            var userEmail = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (!string.IsNullOrWhiteSpace(userEmail))
            {
                comment.UserEmail = userEmail;
            }
            comment.CreatedAt = DateTime.UtcNow;
            _commentService.Create(comment);
            return CreatedAtAction(nameof(GetBySongId), new { songId = comment.SongId }, comment);
        }

        [HttpGet("song/{songId}")]
        public ActionResult<List<Comment>> GetBySongId(string songId)
        {
            var comments = _commentService.GetBySongId(songId);
            return Ok(comments);
        }

        [HttpPost("{commentId}/like")]
        public IActionResult ToggleLike(string commentId)
        {
            var userEmail = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (string.IsNullOrWhiteSpace(userEmail))
            {
                return Unauthorized("User not authenticated");
            }

            var success = _commentService.LikeComment(commentId, userEmail);
            if (!success)
            {
                return NotFound("Comment not found");
            }

            var updatedComment = _commentService.GetById(commentId);
            return Ok(updatedComment);
        }
    }
}


