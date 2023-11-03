using MediatR;

namespace SecretCode.Api.Features.User.Queries;

public class GetUsersQuery : IRequest<List<GetUsersQuery.Response>>
{
    public class Response
    {
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public bool Deleted { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }
}
