using Microsoft.AspNetCore.Mvc;
using MVC.Data;
using MVC.Models;

namespace MVC.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            IEnumerable<Product> products = _context.Products;
            return View(products);
        }

        ////Create Product
        //GET
        public IActionResult Create()
        {
            return View();
        }

        //POST
        [HttpPost]
        public IActionResult Create(Product product)
        {
            if (!string.IsNullOrEmpty(product.Name))
            {
                var duplicatedProduct = _context.Products
                    .FirstOrDefault(p => p.Name.ToLower() == product.Name.ToLower());
                if (duplicatedProduct != null)
                {
                    //ModelState.AddModelError(String.Empty, "This product name is duplicated.");
                    ModelState.AddModelError("name", "This product name is duplicated.");
                }
            }
            if (ModelState.IsValid)
            {
                _context.Products.Add(product);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }

        ////Update Product
        //GET
        public IActionResult Update(int id)
        {
            if (id == 0)
            {
                return NotFound();
            }
            var product = _context.Products.FirstOrDefault(p => p.Id == id);
            if (product == null)
            {
                return NotFound();
            }
            return View(product);
        }

        //POST
        [HttpPost]
        public IActionResult Update(Product product)
        {
            var productNameFromDb = _context.Products.Find(product.Id).Name;
            if (!string.IsNullOrEmpty(product.Name))
            {
                var duplicatedProduct = _context.Products
                    .FirstOrDefault(p => p.Name.ToLower() == product.Name.ToLower());
                if (duplicatedProduct != null && duplicatedProduct.Name.ToLower() != productNameFromDb.ToLower())
                {
                    //ModelState.AddModelError(String.Empty, "This product name is duplicated.");
                    ModelState.AddModelError("name", "This product name is duplicated.");
                }
            }
            if (ModelState.IsValid)
            {
                _context.ChangeTracker.Clear();
                _context.Products.Update(product);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }
    }
}
