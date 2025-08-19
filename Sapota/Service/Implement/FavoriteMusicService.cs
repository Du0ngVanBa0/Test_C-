using Sapota.DTO.Music;
using Sapota.DTO;
using Sapota.Model;
using Sapota.Repository.Implement;
using Sapota.Repository.Interface;
using Sapota.Service.Interface;

namespace Sapota.Service.Implement
{
    public class FavoriteMusicService : GenericService<FavoriteMusic, FavoriteMusicDto, CreateFavoriteMusicDto, UpdateFavoriteMusicDto>, IFavoriteMusicService
    {
        public FavoriteMusicService(IGenericRepository<FavoriteMusic> repository) : base(repository)
        {
        }

        public async Task<IEnumerable<FavoriteMusicDto>> GetByUserIdAsync(Guid userId)
        {
            return await GetAllAsync(fm => fm.UserId == userId);
        }

        public async Task<PagedResult<FavoriteMusicDto>> GetPagedByUserIdAsync(Guid userId, int pageNumber, int pageSize)
        {
            var entities = await _repository.GetPagedAsync(pageNumber, pageSize, fm => fm.UserId == userId);
            var totalCount = await _repository.CountAsync(fm => fm.UserId == userId);

            return new PagedResult<FavoriteMusicDto>
            {
                Items = entities.Select(MapToDto).ToList(),
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<IEnumerable<FavoriteMusicDto>> SearchAsync(Guid userId, string searchTerm)
        {
            return await GetAllAsync(fm => fm.UserId == userId &&
                (fm.Title.Contains(searchTerm) || fm.Artist.Contains(searchTerm)));
        }

        public async Task<FavoriteMusicDto?> GetByIdAndUserIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.GetFirstOrDefaultAsync(fm => fm.Id == id && fm.UserId == userId);
            return entity != null ? MapToDto(entity) : null;
        }

        public async Task<FavoriteMusicDto> CreateForUserAsync(CreateFavoriteMusicDto createDto, Guid userId)
        {
            var entity = new FavoriteMusic
            {
                Title = createDto.Title,
                Artist = createDto.Artist,
                UserId = userId,
                createdBy = userId,
                updatedBy = userId
            };

            entity = await _repository.AddAsync(entity);
            return MapToDto(entity);
        }

        public async Task<FavoriteMusicDto?> UpdateByIdAndUserIdAsync(Guid id, UpdateFavoriteMusicDto updateDto, Guid userId)
        {
            var entity = await _repository.GetFirstOrDefaultAsync(fm => fm.Id == id && fm.UserId == userId);
            if (entity == null)
                return null;

            entity.Title = updateDto.Title;
            entity.Artist = updateDto.Artist;
            entity.updatedBy = userId;

            entity = await _repository.UpdateAsync(entity);
            return MapToDto(entity);
        }

        public async Task<bool> DeleteByIdAndUserIdAsync(Guid id, Guid userId)
        {
            var entity = await _repository.GetFirstOrDefaultAsync(fm => fm.Id == id && fm.UserId == userId);
            if (entity == null)
                return false;

            return await _repository.DeleteAsync(entity);
        }

        protected override FavoriteMusicDto MapToDto(FavoriteMusic entity)
        {
            return new FavoriteMusicDto
            {
                Id = entity.Id,
                Title = entity.Title,
                Artist = entity.Artist
            };
        }

        protected override FavoriteMusic MapToEntity(CreateFavoriteMusicDto createDto)
        {
            return new FavoriteMusic
            {
                Title = createDto.Title,
                Artist = createDto.Artist
            };
        }

        protected override void UpdateEntityFromDto(FavoriteMusic entity, UpdateFavoriteMusicDto updateDto)
        {
            entity.Title = updateDto.Title;
            entity.Artist = updateDto.Artist;
        }
    }
}
