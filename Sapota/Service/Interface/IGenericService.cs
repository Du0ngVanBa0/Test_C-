using Sapota.DTO;
using System.Linq.Expressions;

namespace Sapota.Repository.Interface
{
    public interface IGenericService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : class
        where TDto : class
        where TCreateDto : class
        where TUpdateDto : class
    {
        Task<IEnumerable<TDto>> GetAllAsync();
        Task<IEnumerable<TDto>> GetAllAsync(Expression<Func<TEntity, bool>> predicate);
        Task<TDto?> GetByIdAsync(object id);
        Task<TDto> CreateAsync(TCreateDto createDto);
        Task<TDto?> UpdateAsync(object id, TUpdateDto updateDto);
        Task<bool> DeleteAsync(object id);
        Task<PagedResult<TDto>> GetPagedAsync(int pageNumber, int pageSize);
    }
}
