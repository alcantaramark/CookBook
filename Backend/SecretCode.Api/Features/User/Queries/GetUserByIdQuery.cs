using Azure;
using MediatR;

namespace SecretCode.Api;

public class GetUserByIdQuery : IRequest<GetUserByIdQuery.Response>
{
    public Guid Id { get; set; }
    public class Response
    {
        public Guid Id { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public bool Deleted { get; set; }
    }
}
