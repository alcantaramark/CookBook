using System;

namespace SecretCode.Dto;

public class BaseModelDto
{
    #region Constructors
    public BaseModelDto()
    {
        Id = Guid.NewGuid();
        DateCreated = DateTime.UtcNow;
        DateModified = DateTime.UtcNow;
        Deleted = false;   
    }
    #endregion

    #region Properties
    public Guid Id { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
    public bool Deleted { get; set; }
    #endregion
}
