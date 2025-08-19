using Sapota.Repository.Interface;
using System.Linq.Expressions;
using Sapota.DTO;

namespace Sapota.Repository.Implement
{
    public abstract class GenericService<TEntity, TDto, TCreateDto, TUpdateDto>
        : IGenericService<TEntity, TDto, TCreateDto, TUpdateDto>
        where TEntity : class
        where TDto : class
        where TCreateDto : class
        where TUpdateDto : class
    {
        protected readonly IGenericRepository<TEntity> _repository;

        protected GenericService(IGenericRepository<TEntity> repository)
        {
            _repository = repository;
        }

        public virtual async Task<IEnumerable<TDto>> GetAllAsync()
        {
            var entities = await _repository.GetAllAsync();
            return entities.Select(MapToDto);
        }

        public virtual async Task<IEnumerable<TDto>> GetAllAsync(Expression<Func<TEntity, bool>> predicate)
        {
            var entities = await _repository.GetAllAsync(predicate);
            return entities.Select(MapToDto);
        }

        public virtual async Task<TDto?> GetByIdAsync(object id)
        {
            var entity = await _repository.GetByIdAsync(id);
            return entity != null ? MapToDto(entity) : null;
        }

        public virtual async Task<TDto> CreateAsync(TCreateDto createDto)
        {
            var entity = MapToEntity(createDto);
            entity = await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public virtual async Task<TDto?> UpdateAsync(object id, TUpdateDto updateDto)
        {
            var entity = await _repository.GetByIdAsync(id);
            if (entity == null)
                return null;

            UpdateEntityFromDto(entity, updateDto);
            entity = await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        public virtual async Task<bool> DeleteAsync(object id)
        {
            return await _repository.DeleteAsync(id);
        }

        public virtual async Task<PagedResult<TDto>> GetPagedAsync(int pageNumber, int pageSize)
        {
            var entities = await _repository.GetPagedAsync(pageNumber, pageSize);
            var totalCount = await _repository.CountAsync();

            return new PagedResult<TDto>
            {
                Items = entities.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        // Abstract methods to be implemented by concrete services
        protected abstract TDto MapToDto(TEntity entity);
        protected abstract TEntity MapToEntity(TCreateDto createDto);
        protected abstract void UpdateEntityFromDto(TEntity entity, TUpdateDto updateDto);
    }
}
