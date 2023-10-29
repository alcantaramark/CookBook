using MediatR;
using SecretCode.Api.Features.Users.Queries;
using SecretCode.Api.Repositories.Interfaces;
using AutoMapper;


namespace SecretCode.Api.Features.Users.Handlers;

public class GetUsersHandler : IRequestHandler<GetUsersQuery, List<GetUsersQuery.Response>>
{
    private readonly IUserRepository _userRepository;
    public GetUsersHandler(IUserRepository userRepository) => _userRepository = userRepository;

    public async Task<List<GetUsersQuery.Response>> Handle(GetUsersQuery request, CancellationToken cancellationToken)
    {
        //return await _userRepository.GetAllAsync().ProjectTo<GetUsersQuery.Response>();
        return new List<GetUsersQuery.Response>();
    }
}
