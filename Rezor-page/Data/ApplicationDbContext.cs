using Microsoft.EntityFrameworkCore;
using MVC.Models;
using Rezor_page.Models;

namespace Rezor_page.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
    }
}
