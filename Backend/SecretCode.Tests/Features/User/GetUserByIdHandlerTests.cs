using FluentAssertions;
using SecretCode.Api;
using SecretCode.Api.Features.User.Handlers;
using SecretCode.Tests.Global;
using Xunit;

namespace SecretCode.Tests.Features.User;

[Collection("Fixture Collection")]
public class GetUserByIdHandlerTests 
{
    private readonly GlobalFixture _fixture;

    public GetUserByIdHandlerTests(GlobalFixture fixture) => _fixture = fixture;

    [Fact]
    public async Task Handle_ShouldReturnUser_WhenExecuted()
    {
        //Arrange
        var id = _fixture._users.FirstOrDefault().Id;
        var request = new GetUserByIdQuery() { Id = id };
        var handler = new GetUserByIdHandler(_fixture._contextMock.Object, _fixture._mapper);
        
        //Act
        var user = await handler.Handle(request, default);

        //Assert
        user.Id.Should().Be(id);
        user.Should().NotBeNull();
    }
}
