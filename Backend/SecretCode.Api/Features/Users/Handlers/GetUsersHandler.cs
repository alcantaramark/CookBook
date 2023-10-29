using MediatR;
using SecretCode.Api.Features.Users.Queries;
using SecretCode.Api.Data;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;


namespace SecretCode.Api.Features.Users.Handlers;

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
        return await _context.Users.ProjectTo<GetUsersQuery.Response>(_config).ToListAsync();
    }
}
