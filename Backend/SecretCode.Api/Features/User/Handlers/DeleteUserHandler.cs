namespace SecretCode.Api;

using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using SecretCode.Api.Data;
using SecretCode.Api.Features.User.Commands;

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand>
{
    private readonly SecretCodeDataContext _context;

    public DeleteUserHandler(SecretCodeDataContext context) => _context = context;
    public async Task Handle(DeleteUserCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.Users.SingleOrDefaultAsync(_ => _.Id == request.Id);

            if (user is not null)
            {
                await _context.Database.BeginTransactionAsync();
                _context.Remove(user);
                await _context.SaveChangesAsync();
                await _context.Database.CommitTransactionAsync();
            }
        }
        catch(Exception ex)
        {
            await _context.Database.RollbackTransactionAsync();
            
        }
        finally
        {
            await _context.DisposeAsync();
        }
    }
}
