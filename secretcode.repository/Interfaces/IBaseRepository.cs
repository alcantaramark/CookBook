using System.Linq;
using System.Linq.Expressions;
using System.Collections.Generic;

namespace SecretCode.Repository.Interfaces;

public interface IBaseRepository<T> where T: class
{
#region Contract Methods
Task<T> GetAsync(Guid id);
Task<T> GetAsync(Expression<Func<T, bool>> where);
Task<List<T>> GetAsync(Expression<Func<T, bool>> where, int? page = null, int? pageSize = null);
Task<List<T>> GetAsync(int? page = null, int? pageSize = null);
Task<List<T>> GetAllAsync();
Task AddAsync(T model);
Task AddAsync(List<T> models);
Task UpdateAsync(T model);
Task RemoveAsync(Guid id);
Task RemoveAsync(List<T> models);
Task RemoveAsync(T model, params Expression<Func<T, object>>[] includeProperties);
#endregion
}
