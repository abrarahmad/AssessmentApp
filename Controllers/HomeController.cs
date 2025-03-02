using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AssessmentApp.Models;

namespace AssessmentApp.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index()
    {
        return View();
    }
    [HttpPost]
    public IActionResult SubmitForm([FromBody] EnglishArabicFormViewModel formData)
    {  
        return Ok(new { message = "Form submitted successfully!" });
    }
}
