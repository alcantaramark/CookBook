using Microsoft.AspNetCore.Mvc;
using SecretCode.Repository.Interfaces;

namespace SecretCode.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    #region Private Members
    private readonly IUserRepository _userRepository;
    #endregion
    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        try
        {
            var users = await _userRepository.GetAllAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest("Error processing Request");
        }
    }
}
