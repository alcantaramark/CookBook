namespace SecretCode.Api.Models;

public class BaseModel
{
    public BaseModel()
    {
        Id = Guid.NewGuid();
        DateCreated = DateTime.UtcNow;
        DateModified = DateTime.UtcNow;
        Deleted = false;
    }

    public Guid Id { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateModified { get; set; }
    public bool Deleted { get; set; }
}
