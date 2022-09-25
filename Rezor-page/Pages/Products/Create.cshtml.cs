using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Rezor_page.Data;
using Rezor_page.Models;

namespace Rezor_page.Pages.Products
{
    [BindProperties]
    public class CreateModel : PageModel
    {
        private readonly ApplicationDbContext _context;
        public Product Product { get; set; }
        public CreateModel(ApplicationDbContext context)
        {
            _context = context;
        }
        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPost()
        {
            await _context.AddAsync(Product);
            await _context.SaveChangesAsync();
            return RedirectToPage("Index");
        }
    }
}
