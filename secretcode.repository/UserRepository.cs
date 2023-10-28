using SecretCode.Model;
using SecretCode.Repository.Interfaces;

namespace SecretCode.Repository;

public class UserRepository: BaseRepository<User>, IUserRepository
{
    #region Private Members
    private readonly SecretCodeDataContext _context;
    #endregion

    #region Constructors
    public UserRepository(SecretCodeDataContext context): base(context)
    {
        _context = context;
    }
    #endregion
}
