using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using SecretCode.Api.Repositories.Interfaces;

namespace SecretCode.Api.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly DbContext _context;

    public BaseRepository(DbContext context) => _context = context;

    public async Task AddAsync(T model)
    {
        try
        {
            await _context.Set<T>().AddAsync(model);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task AddAsync(List<T> models)
    {
        try
        {
            await _context.Set<T>().AddRangeAsync(models);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<List<T>> GetAllAsync()
    {
        try
        {
            return await Task.Run(() => _context.Set<T>().ToList<T>());
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<T> GetAsync(Guid id)
    {
        try
        {
            var entity = await _context.Set<T>().FindAsync(id);

            if (entity is not null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }
            
            return entity;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<T> GetAsync(Expression<Func<T, bool>> where)
    {
        try
        {
            var entity = await _context.Set<T>().Where(where).FirstOrDefaultAsync();

            if (entity is not null)
            {
                _context.Entry(entity).State = EntityState.Detached;
            }

            return entity;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<List<T>> GetAsync(Expression<Func<T, bool>> where, int? page = null, int? pageSize = null)
    {
        try
        {
            var query = await _context.Set<T>().Where(where).ToListAsync();
                
            if (page.HasValue && pageSize.HasValue)
                return query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList<T>();
            else
                return query.ToList<T>();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task<List<T>> GetAsync(int? page = null, int? pageSize = null)
    {
        try
        { 
            var query = await _context.Set<T>().ToListAsync();
                
            if (page.HasValue && pageSize.HasValue)
                return query.Skip((page.Value - 1) * pageSize.Value).Take(pageSize.Value).ToList<T>();
            else
                return query.ToList<T>();            
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task RemoveAsync(Guid id)
    {
        try
        {
            var entity = await _context.Set<T>().FindAsync(id);
            _context.Set<T>().Remove(entity);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task RemoveAsync(List<T> models)
    {
        try
        {
            await Task.Run(async () =>  
            { 
                _context.Set<T>().RemoveRange(models);
                await _context.SaveChangesAsync();
            });
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task RemoveAsync(T model, params Expression<Func<T, object>>[] includeProperties)
    {
        try
        {
            await Task.Run(async () =>
            {
                _context.Set<T>().Attach(model);
                var dbEntry = _context.Entry(model);
                
                foreach (var includedProperty in includeProperties)
                {
                    dbEntry.Property(includedProperty).IsModified = true;
                }
                await _context.SaveChangesAsync();
            });
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }

    public async Task UpdateAsync(T model)
    {
        try
        {
            await Task.Run(async () => 
            {
                _context.Set<T>();
                _context.Entry(model).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            });
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
