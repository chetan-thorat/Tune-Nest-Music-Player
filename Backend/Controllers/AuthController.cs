using DnsClient;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TuneNext01.Models;
using TuneNext01.Services;

namespace TuneNext01.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly IConfiguration _config;

        public AuthController(UserService userService, IConfiguration config)
        {
            _userService = userService;
            _config = config;
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Name, user.Email)
                }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup(User user)
        {
            var existingUser = await _userService.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(new { message = "User already exists" });

            user.Id = ObjectId.GenerateNewId().ToString();
            user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

            await _userService.CreateUserAsync(user);

            var token = GenerateJwtToken(user);

            return Ok(new
            {
                success = true,
                token,
                email = user.Email
            });
        }

        //[HttpPost("login")]
        //public async Task<IActionResult> Login([FromBody] Login login)
        //{
        //    var user = await _userService.GetUserByEmailAsync(login.Email);
        //    if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
        //        return Unauthorized(new { message = "Invalid email or password" });

        //    var token = GenerateJwtToken(user);

        //    return Ok(new
        //    {
        //        success = true,
        //        token,
        //        email = user.Email
        //    });
        //}

        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto request)
        {
            try
            {
                var payload = await GoogleJsonWebSignature.ValidateAsync(request.Credential);

                var user = await _userService.GetUserByEmailAsync(payload.Email);
                if (user == null)
                {
                    user = new User
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Email = payload.Email,
                        Password = ""
                    };
                    await _userService.CreateUserAsync(user);
                }

                var token = GenerateJwtToken(user);

                return Ok(new
                {
                    success = true,
                    token,
                    email = user.Email
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("google")]
        public IActionResult GoogleLoginRedirect()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/auth/google/callback" };
            return Challenge(properties, "Google");
        }

        [HttpGet("google/callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var authenticateResult = await HttpContext.AuthenticateAsync("Cookies");

            if (!authenticateResult.Succeeded)
                return Unauthorized();

            var claims = authenticateResult.Principal.Claims.ToList();
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            var user = await _userService.GetUserByEmailAsync(email);
            if (user == null)
            {
                user = new User
                {
                    Id = ObjectId.GenerateNewId().ToString(),
                    Email = email,
                    Password = ""
                };
                await _userService.CreateUserAsync(user);
            }

            var token = GenerateJwtToken(user);

            return Redirect($"http://localhost:3000/login-success?token={token}");
        }

        [Authorize]
        [HttpGet("protected")]
        public IActionResult GetProtectedData()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;

            return Ok(new
            {
                email,
                token = HttpContext.Request.Headers["Authorization"].ToString().Replace("Bearer ", "")
            });
        }
    }
}