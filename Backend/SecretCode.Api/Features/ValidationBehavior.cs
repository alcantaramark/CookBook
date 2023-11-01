using System.ComponentModel.DataAnnotations;
using FluentValidation;
using FluentValidation.Results;
using MediatR;


namespace SecretCode.Api.Features;

public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;
    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators) => _validators = validators;
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var context = new ValidationContext<TRequest>(request);

        var validationFailures = await Task.WhenAll(
            _validators.Select(validator => validator.ValidateAsync(context)));
        
        var errors = validationFailures
            .Where(_ => !_.IsValid)
            .SelectMany(_ => _.Errors)
            .Select(_ => new ValidationFailure(_.PropertyName, _.ErrorMessage))
            .ToList();

        if (errors.Any())
        {
            throw new FluentValidation.ValidationException(errors);
        }

        return await next();
    }
}
