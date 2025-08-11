using Microsoft.AspNetCore.Mvc;
using TuneNext01.Models;
using TuneNext01.Services;

namespace TuneNext01.Controllers
{
    public class HomeController : Controller
    {
        private readonly SongService _songService;

        public HomeController(SongService songService)
        {
            _songService = songService;
        }

        //public IActionResult Index()
        //{
        //    var viewModel = new SongViewModel
        //    {
        //        Songs = _songService.Get()
        //    };
        //    return View(viewModel);
        //}
    }
}
