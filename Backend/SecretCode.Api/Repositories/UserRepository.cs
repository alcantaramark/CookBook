using SecretCode.Api.Models;
using SecretCode.Api.Repositories.Interfaces;
using SecretCode.Api.Data;

namespace SecretCode.Api.Repositories;

public class UserRepository : BaseRepository<User>, IUserRepository
{
    private readonly SecretCodeDataContext _context;

    public UserRepository(SecretCodeDataContext context): base(context) => _context = context;
}
