using AutoMapper;
using SecretCode.Api.Features.User.Commands;
using SecretCode.Api.Features.User.Queries;

namespace SecretCode.Api.Features.User;

public class MappingProfile : Profile
{
        public MappingProfile()
        {
        	CreateMap<Models.User, GetUsersQuery.Response>().ReverseMap();
            CreateMap<Models.User, GetUserByIdQuery.Response>().ReverseMap();
			CreateMap<Models.User, CreateUserCommand>().ReverseMap();
        }
}
