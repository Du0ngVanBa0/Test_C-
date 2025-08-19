using Microsoft.EntityFrameworkCore;
using Sapota.Model;
using Sapota.Repository.Interface;
using System.Linq.Expressions;

namespace Sapota.Repository.Implement
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        protected readonly AppDbContext _context;
        protected readonly DbSet<T> _dbSet;

        public GenericRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await GetQueryable().ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> predicate)
        {
            return await GetQueryable(predicate).ToListAsync();
        }

        public virtual async Task<T?> GetByIdAsync(object id)
        {
            var entity = await _dbSet.FindAsync(id);

            if (entity != null && typeof(T).IsSubclassOf(typeof(BaseModel)))
            {
                var isActive = (bool)typeof(T).GetProperty("IsActive")?.GetValue(entity)!;
                if (!isActive)
                    return null;
            }

            return entity;
        }

        public virtual async Task<T?> GetFirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            return await GetQueryable(predicate).FirstOrDefaultAsync();
        }

        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            return await GetQueryable(predicate).AnyAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            if (entity is BaseModel baseEntity)
            {
                baseEntity.CreatedAt = DateTime.UtcNow;
                baseEntity.UpdatedAt = DateTime.UtcNow;
                baseEntity.IsActive = true;
            }

            await _dbSet.AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                if (entity is BaseModel baseEntity)
                {
                    baseEntity.CreatedAt = DateTime.UtcNow;
                    baseEntity.UpdatedAt = DateTime.UtcNow;
                    baseEntity.IsActive = true;
                }
            }

            await _dbSet.AddRangeAsync(entities);
            await _context.SaveChangesAsync();
            return entities;
        }

        public virtual async Task<T> UpdateAsync(T entity)
        {
            if (entity is BaseModel baseEntity)
            {
                baseEntity.UpdatedAt = DateTime.UtcNow;
            }

            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public virtual async Task<bool> DeleteAsync(object id)
        {
            var entity = await _dbSet.FindAsync(id);
            if (entity == null)
                return false;

            return await DeleteAsync(entity);
        }

        public virtual async Task<bool> DeleteAsync(T entity)
        {
            _dbSet.Remove(entity);

            await _context.SaveChangesAsync();
            return true;
        }

        public virtual async Task<int> CountAsync()
        {
            return await GetQueryable().CountAsync();
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            return await GetQueryable(predicate).CountAsync();
        }

        public virtual async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize)
        {
            return await GetQueryable()
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>> predicate)
        {
            return await GetQueryable(predicate)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public virtual IQueryable<T> GetQueryable()
        {
            var query = _dbSet.AsQueryable();

            if (typeof(T).IsSubclassOf(typeof(BaseModel)))
            {
                query = query.Where(e => EF.Property<bool>(e, "IsActive"));
            }

            return query;
        }

        public virtual IQueryable<T> GetQueryable(Expression<Func<T, bool>> predicate)
        {
            return GetQueryable().Where(predicate);
        }
    }
}
