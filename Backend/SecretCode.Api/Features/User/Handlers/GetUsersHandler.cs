using MediatR;
using SecretCode.Api.Features.User.Queries;
using SecretCode.Api.Data;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace SecretCode.Api.Features.User.Handlers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<GetUsersQuery.Response>>
{
    private readonly SecretCodeDataContext _context;
    private readonly IMapper _mapper;

    public GetUsersHandler(SecretCodeDataContext context, IMapper mapper)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<List<GetUsersQuery.Response>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var users = _context.Users;
            return await users.ProjectTo<GetUsersQuery.Response>(_mapper.ConfigurationProvider).ToListAsync();
        }
        catch
        {
            throw;
        }
        finally
        {
            await _context.DisposeAsync();
        }
    }
}
