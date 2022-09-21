using System.ComponentModel.DataAnnotations;

namespace MVC.Models
{
    public class Product
    {
        public int Id { get; set; }
        [Required(ErrorMessage = "Enter product name"), StringLength(50), Display(Name = "Product Name")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Enter product price"), Range(1, Double.PositiveInfinity)]
        public double? Price { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
