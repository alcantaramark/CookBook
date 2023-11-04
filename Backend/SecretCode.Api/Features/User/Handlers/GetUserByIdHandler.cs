using MediatR;
using AutoMapper;
using SecretCode.Api.Data;
using Microsoft.EntityFrameworkCore;
using AutoMapper.QueryableExtensions;

namespace SecretCode.Api.Features.User.Handlers;

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, GetUserByIdQuery.Response>
{
    SecretCodeDataContext _context;
    IMapper _mapper;
    public GetUserByIdHandler(SecretCodeDataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public async Task<GetUserByIdQuery.Response> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
    {
        try
        {
            var user = await _context.Users
                    .Where(_ => _.Id == request.Id)
                    .ProjectTo<GetUserByIdQuery.Response>(_mapper.ConfigurationProvider)
                    .FirstAsync();
         
            return user;
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
