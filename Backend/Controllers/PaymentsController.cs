using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TuneNext01.Models;
using TuneNext01.Services;

namespace TuneNext01.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly PaymentService _service;

        public PaymentsController(PaymentService service)
        {
            _service = service;
        }

        [HttpPost]
        public IActionResult Create([FromBody] Payment payment)
        {
            var claimEmail = User?.Claims?.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            if (!string.IsNullOrWhiteSpace(claimEmail))
            {
                payment.Email = claimEmail.Trim().ToLower();
            }

            if (string.IsNullOrWhiteSpace(payment.Email))
            {
                return BadRequest("Email is required");
            }

            payment.Email = payment.Email.Trim().ToLower();
            payment.CreatedAt = DateTime.UtcNow;
            _service.Create(payment);
            return Ok(new { success = true });
        }

        [HttpGet("{email}")]
        public IActionResult GetByEmail(string email)
        {
            if (string.IsNullOrWhiteSpace(email)) return BadRequest("Email is required");
            var list = _service.GetByEmail(email);
            return Ok(list);
        }
    }
}




