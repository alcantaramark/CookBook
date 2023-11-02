using Xunit;

namespace SecretCode.Tests.Global;

[CollectionDefinition("Fixture Collection")]
public class GlobalFixtureCollection : ICollectionFixture<GlobalFixture>
{

}
