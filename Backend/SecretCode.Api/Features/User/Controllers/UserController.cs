using Microsoft.AspNetCore.Mvc;
using SecretCode.Api.Features.User.Queries;
using MediatR;
using SecretCode.Api.Features.User.Commands;
using System.Net;

namespace SecretCode.Api.Features.User.Controllers;

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
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpGet]
    [Route("/:id")]
    public async Task<IActionResult> GetById(Guid id)
    {
        try
        {
            var user = await _mediator.Send(new GetUserByIdQuery { Id = id });

            if (user is not null)
                return Ok(user);
            else
                return NotFound("No user found");
        }
        catch
        {
            return StatusCode(500);
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
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpDelete]
    [Route("/:id")]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _mediator.Send(new DeleteUserCommand{ Id = id });
            return Ok();
        }
        catch
        {
            return StatusCode(500);
        }
    }

    [HttpPost]
    [Route(":/id")]
    public async Task<IActionResult> Edit(Guid id, [FromBody]EditUserCommand user)
    {
        try
        {
            await _mediator.Send(user);
            return Ok();
        }
        catch
        {
            return StatusCode(500);
        }
    }
}
