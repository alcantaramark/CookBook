using MediatR;
using Microsoft.EntityFrameworkCore;
using SecretCode.Api.Data;
using SecretCode.Api.Features.User.Commands;

namespace SecretCode.Api.Features.User.Handlers;

public class EditUserHandler : IRequestHandler<EditUserCommand>
{
    private SecretCodeDataContext _context;
    public EditUserHandler(SecretCodeDataContext context) => _context = context;
    public async Task Handle(EditUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.Users.SingleOrDefaultAsync(_ => _.Id == request.Id);
            
            if (user is not null)
            {
                user.Name = request.Name;
                user.Email = request.Email;
                user.Deleted = request.Deleted;
                user.DateModified = DateTime.UtcNow;

                await _context.Database.BeginTransactionAsync();
                await _context.SaveChangesAsync();
                await _context.Database.CommitTransactionAsync();
            }
        }
        catch
        {
            await _context.Database.RollbackTransactionAsync();
        }
        finally
        {
            await _context.DisposeAsync();
        }
    }
}
