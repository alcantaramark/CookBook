using Microsoft.AspNetCore.Mvc;
using SecretCode.Api.Features.Users.Queries;
using MediatR;

namespace SecretCode.Api.Features.Users.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;
    public UserController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var users = await _mediator.Send(new GetUsersQuery());
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest("Error processing Request");
        }
    }
}
