using Microsoft.AspNetCore.Mvc;
using SecretCode.Api.Features.User.Queries;
using MediatR;
using SecretCode.Api.Features.User.Commands;

namespace SecretCode.Api.Features.User.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IMediator _mediator;
    private const string _errorMessage = "Error processing your request";
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
            return BadRequest(_errorMessage);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody]CreateUserCommand newUser)
    {
        try
        {
            await _mediator.Send(newUser);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(_errorMessage);
        }
    }
}
