using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TuneNext01.Models;

namespace TuneNext01.Services
{
    public class PaymentService
    {
        private readonly IMongoCollection<Payment> _payments;

        public PaymentService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _payments = database.GetCollection<Payment>("Payments");
        }

        public void Create(Payment payment) => _payments.InsertOne(payment);

        public List<Payment> GetByEmail(string email)
        {
            var normalized = (email ?? string.Empty).Trim().ToLower();
            return _payments.Find(p => p.Email == normalized).ToList();
        }
    }
}




