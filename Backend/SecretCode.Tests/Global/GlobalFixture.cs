using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Moq;
using SecretCode.Api.Data;
using SecretCode.Api.Models;

namespace SecretCode.Tests.Global;

public class GlobalFixture : IDisposable
{
    public Mock<SecretCodeDataContext> _contextMock;
    public Mock<IMapper> _mapperMock;
    public Mock<DatabaseFacade> databaseFacadeMock;
    
    public List<User> _users;
    private User user1, user2, user3;
    public GlobalFixture()
    {
        #region Users
        user1 = new User 
        { 
            DateCreated = DateTime.UtcNow,
            DateModified = DateTime.UtcNow,
            Deleted = false,
            Name = "Test User 1",
            Email = "TestUser1@email.com"
        };

        user2 = new User 
        { 
            DateCreated = DateTime.UtcNow,
            DateModified = DateTime.UtcNow,
            Deleted = false,
            Name = "Test User 2",
            Email = "TestUser2@email.com"
        };

        user3 = new User 
        { 
            DateCreated = DateTime.UtcNow,
            DateModified = DateTime.UtcNow,
            Deleted = false,
            Name = "Test User 3",
            Email = "TestUser3@email.com"
        };

        _users = new List<User> { user1, user2, user3 };
        #endregion

        #region DB Context
        IQueryable<User> usersData =  _users.AsQueryable();
        Mock<DbSet<User>> usersMockSet = new Mock<DbSet<User>>();
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.Provider).Returns(usersData.Provider);
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.Expression).Returns(usersData.Expression);
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.ElementType).Returns(usersData.ElementType);
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.GetEnumerator()).Returns(usersData.GetEnumerator());

        _contextMock = new Mock<SecretCodeDataContext>();
        _contextMock.Setup(_ => _.Users).Returns(usersMockSet.Object);
        
        databaseFacadeMock = new Mock<DatabaseFacade>(_contextMock.Object);
        databaseFacadeMock.Setup(_ => _.BeginTransactionAsync(It.IsAny<CancellationToken>()));
        databaseFacadeMock.Setup(_ => _.CommitTransactionAsync(It.IsAny<CancellationToken>()));
        databaseFacadeMock.Setup(_ => _.RollbackTransactionAsync(It.IsAny<CancellationToken>()));
        _contextMock.Setup(_ => _.Database).Returns(databaseFacadeMock.Object);

        #endregion

        _mapperMock = new Mock<IMapper>();

    }
    public void Dispose()
    {
            
    }    
}

