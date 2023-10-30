using MediatR;
using SecretCode.Api.Features.User.Queries;
using SecretCode.Api.Data;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.CodeDom;

namespace SecretCode.Api.Features.User.Handlers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<GetUsersQuery.Response>>
{
    private readonly SecretCodeDataContext _context;
    private readonly AutoMapper.IConfigurationProvider _config;

    public GetUsersHandler(SecretCodeDataContext context, AutoMapper.IConfigurationProvider config)
    {
        _config = config;
        _context = context;
    }

    public async Task<List<GetUsersQuery.Response>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var users = _context.Users;
            return await users.ProjectTo<GetUsersQuery.Response>(_config).ToListAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            await _context.DisposeAsync();
        }
    }
}
