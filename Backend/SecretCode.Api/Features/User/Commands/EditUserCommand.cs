using MediatR;

namespace SecretCode.Api.Features.User.Commands;

public class EditUserCommand : IRequest
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public bool Deleted { get; set; }
}
