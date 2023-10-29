using MediatR;

namespace SecretCode.Api.Features.User.Commands;

public class CreateUserCommand : IRequest
{
    public string Name { get; set; }
    public string Email { get; set; }
}
