using Microsoft.EntityFrameworkCore;
using SecretCode.Api.Data;
using System.Reflection;
using SecretCode.Api.Features.User;
using SecretCode.Api.Features;
using FluentValidation;


var builder = WebApplication.CreateBuilder(args);
ConfigurationManager configuration = builder.Configuration;
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Configuration.AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
builder.Configuration.AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true);
//Register Services
builder.Services.AddDbContext<SecretCodeDataContext>(options => 
    options.UseSqlServer(configuration.GetConnectionString("AwsDatabase")));

builder.Services.AddMediatR(cfg => 
{ 
    cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
    cfg.AddOpenBehavior(typeof(ValidationBehavior<,>));
});
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
