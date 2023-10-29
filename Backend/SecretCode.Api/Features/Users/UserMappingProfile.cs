using SecretCode.Api.Models;

using AutoMapper;
using SecretCode.Api.Features.Users.Queries;

namespace SecretCode.Api.Features.Users;

public class UserMappingProfile : Profile
{
    public UserMappingProfile() => CreateMap<User, GetUsersQuery.Response>().ReverseMap();
}
