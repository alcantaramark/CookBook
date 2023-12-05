using SecretCode.Api.Features.User.Handlers;
using SecretCode.Api.Features.User.Queries;
using SecretCode.Tests.Global;
using Xunit;

namespace SecretCode.Tests.Features.User;

[Collection("Fixture Collection")]
public class GetUsersHandlerTests
{
    private readonly GlobalFixture _fixture;

    public GetUsersHandlerTests(GlobalFixture fixture) => _fixture = fixture;

    [Fact]
    public async Task Handle_ShouldReturnAllUsers_WhenExecuted()
    {
        //Arrange
        GetUsersQuery request = new();
        GetUsersHandler handler = new(_fixture._contextMock.Object, _fixture._mapper);
        
        //Act
        var result = await handler.Handle(request, default);

        //Assert;
        Assert.Equal<int>(200, _fixture._users.Count);
    }
}
