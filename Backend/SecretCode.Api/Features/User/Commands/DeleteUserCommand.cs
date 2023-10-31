using MediatR;

namespace SecretCode.Api.Features.User.Commands;

public class DeleteUserCommand : IRequest
{
    public Guid Id { get; set; }
}
