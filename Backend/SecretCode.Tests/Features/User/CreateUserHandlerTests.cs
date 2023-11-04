using Xunit;
using Moq;
using SecretCode.Tests.Global;
using Model = SecretCode.Api.Models;
using SecretCode.Api.Features.User.Handlers;
using SecretCode.Api.Features.User.Commands;
using SecretCode.Api.Features.User.Validators;
using FluentValidation.TestHelper;
using FluentAssertions;

namespace SecretCode.Tests.Features.User;

[Collection("Fixture Collection")]
public class CreateUserHandlerTests
{
    GlobalFixture _fixture;
    public CreateUserHandlerTests(GlobalFixture fixture) => _fixture = fixture;

    [Fact]
    public void Handle_ShouldNotThrowException_ValidationPassed()
    {
        //Arrange
        CreateUserCommand command = new CreateUserCommand{ Name = "Test Name", Email = "TestEmail@email.com" };

        var validator = new CreateUserCommandValidator();
        
        //Act
        var result = validator.TestValidate(command);

        //Assert
        result.ShouldNotHaveAnyValidationErrors();
    }

    [Fact]
    public void Handle_ShouldThrowException_WhenEmailIsNotProvided()
    {
        //Arrange
        CreateUserCommand command = new CreateUserCommand{ Name = "Test Name" };

        var validator = new CreateUserCommandValidator();
        
        //Act
        var result = validator.TestValidate(command);

        //Assert
        result.ShouldHaveValidationErrorFor(_ => _.Email).Only();
    }

    [Fact]
    public void Handle_ShouldThrowException_WhenNameIsNotProvided()
    {
        //Arrange
        CreateUserCommand command = new CreateUserCommand{ Email = "TestMail@mail.com" };

        var validator = new CreateUserCommandValidator();
        
        //Act
        var result = validator.TestValidate(command);

        //Assert
        result.ShouldHaveValidationErrorFor(_ => _.Name).Only();
    }    

    [Fact]
    public async Task Handle_ShouldAddUser_WhenValidationPasses()
    {
        //Arrange
        var initialCount = _fixture._users.Count;
        var handler = new CreateUserHandler(_fixture._contextMock.Object, _fixture._mapper);
        
        CreateUserCommand command = new CreateUserCommand
        {
            Email = "newEmail@testEmail.com",
            Name = "New Name"
        };
        
        //Act
        await handler.Handle(command, default);        
        
        //Assert
        _fixture._users.Count.Should().Be(++initialCount);
        _fixture._users.SingleOrDefault(_ => _.Name == command.Name).Should().NotBeNull();
        _fixture._users.SingleOrDefault(_ => _.Name == command.Name)?.Name.Should().Be(command.Name);
        _fixture._users.SingleOrDefault(_ => _.Name == command.Name)?.Email.Should().Be(command.Email);
        _fixture._contextMock.Verify(_ =>  _.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}