namespace SecretCode.Dto;
public class UserDto: BaseModelDto
{
    #region Constructors
    public UserDto()
    {
    }
    #endregion
    
    #region Properties
    public string Name { get; set; }
    public string Email { get; set; }
    #endregion
}
