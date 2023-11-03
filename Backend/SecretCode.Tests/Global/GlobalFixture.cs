using System.Configuration;
using System.Linq.Expressions;
using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Query;
using Moq;
using SecretCode.Api.Data;
using SecretCode.Api.Features.User;
using SecretCode.Api.Features.User.Commands;
using SecretCode.Api.Features.User.Queries;
using SecretCode.Api.Models;

namespace SecretCode.Tests.Global;

public class GlobalFixture : IDisposable
{
    public Mock<SecretCodeDataContext> _contextMock;
    public IMapper _mapper;
    public Mock<DatabaseFacade> _databaseFacadeMock;
    public Mock<AbstractValidator<CreateUserCommand>> _createUserCommandValidatorMock;
    
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

        #region Mapper
        _mapper = new MapperConfiguration(cfg => 
        {
            cfg.AddProfile(new MappingProfile());
        }).CreateMapper();
        #endregion

        #region DB Context
        var usersData =  _users.AsQueryable();
        Mock<DbSet<User>> usersMockSet = new Mock<DbSet<User>>();
        
        usersMockSet.As<IAsyncEnumerable<User>>()
            .Setup(_ =>  _.GetAsyncEnumerator(default))
            .Returns(new TestAsyncEnumerator<User>(usersData.GetEnumerator()));
        
        usersMockSet.As<IQueryable<User>>()
            .Setup(_ => _.Provider)
            .Returns(new TestAsyncQueryProvider<User>(usersData.Provider));

        usersMockSet.As<IQueryable<User>>().Setup(_ => _.Expression).Returns(usersData.Expression);
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.ElementType).Returns(usersData.ElementType);
        usersMockSet.As<IQueryable<User>>().Setup(_ => _.GetEnumerator()).Returns(usersData.GetEnumerator());

        _contextMock = new Mock<SecretCodeDataContext>();
        _contextMock.Setup(_ => _.Users).Returns(usersMockSet.Object);
        
        _databaseFacadeMock = new Mock<DatabaseFacade>(_contextMock.Object);
        _databaseFacadeMock.Setup(_ => _.BeginTransactionAsync(It.IsAny<CancellationToken>()));
        _databaseFacadeMock.Setup(_ => _.CommitTransactionAsync(It.IsAny<CancellationToken>()));
        _databaseFacadeMock.Setup(_ => _.RollbackTransactionAsync(It.IsAny<CancellationToken>()));
        _contextMock.Setup(_ => _.Database).Returns(_databaseFacadeMock.Object);

        #endregion
        _createUserCommandValidatorMock = new Mock<AbstractValidator<CreateUserCommand>>();

    }
    public void Dispose()
    {
            
    }
}

#region Helpers
public class TestAsyncEnumerable<T> : EnumerableQuery<T>, IAsyncEnumerable<T>, IQueryable<T>
{
    public TestAsyncEnumerable(IEnumerable<T> enumerable)
        : base(enumerable)
    { }

    public TestAsyncEnumerable(Expression expression)
        : base(expression)
    { }

    public IAsyncEnumerator<T> GetEnumerator()
    {
        return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
    }

    public IAsyncEnumerator<T> GetAsyncEnumerator(CancellationToken cancellationToken = default)
    {
        return new TestAsyncEnumerator<T>(this.AsEnumerable().GetEnumerator());
    }

    IQueryProvider IQueryable.Provider
    {
        get { return new TestAsyncQueryProvider<T>(this); }
    }
}

public class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
{
    private readonly IEnumerator<T> _inner;

    public TestAsyncEnumerator(IEnumerator<T> inner)
    {
        _inner = inner;
    }

    public void Dispose()
    {
        _inner.Dispose();
    }

    public T Current
    {
        get
        {
            return _inner.Current;
        }
    }

    public Task<bool> MoveNext(CancellationToken cancellationToken)
    {
        return Task.FromResult(_inner.MoveNext());
    }

    public async ValueTask<bool> MoveNextAsync()
    {
        return await Task.FromResult(_inner.MoveNext());
    }

    public  ValueTask DisposeAsync()
    {
        _inner.Dispose();
        return new ValueTask(Task.CompletedTask);
    }
}

public class TestAsyncQueryProvider<TEntity> : IAsyncQueryProvider
{
    private readonly IQueryProvider _inner;

    internal TestAsyncQueryProvider(IQueryProvider inner)
    {
        _inner = inner;
    }

    public IQueryable CreateQuery(Expression expression)
    {
        switch (expression)
        {
            case MethodCallExpression m:
            {
                var resultType = m.Method.ReturnType;
                var tElement = resultType.GetGenericArguments()[0];
                var queryType = typeof(TestAsyncEnumerable<>).MakeGenericType(tElement);
                return (IQueryable)Activator.CreateInstance(queryType, expression);
            }
        }
        return new TestAsyncEnumerable<TEntity>(expression);
    }

    public IQueryable<TElement> CreateQuery<TElement>(Expression expression)
    {
        return new TestAsyncEnumerable<TElement>(expression);
    }

    public object Execute(Expression expression)
    {
        return _inner.Execute(expression);
    }

    public TResult Execute<TResult>(Expression expression)
    {
        return _inner.Execute<TResult>(expression);
    }

    public IAsyncEnumerable<TResult> ExecuteAsync<TResult>(Expression expression)
    {
        return new TestAsyncEnumerable<TResult>(expression);
    }

    public Task<TResult> ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
    {
        return Task.FromResult(Execute<TResult>(expression));
    }

    TResult IAsyncQueryProvider.ExecuteAsync<TResult>(Expression expression, CancellationToken cancellationToken)
    {
        throw new NotImplementedException();
    }
}
#endregion
