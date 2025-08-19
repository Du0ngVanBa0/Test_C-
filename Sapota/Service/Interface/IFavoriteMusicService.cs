using Sapota.DTO.Music;
using Sapota.DTO;
using Sapota.Model;
using Sapota.Repository.Interface;

namespace Sapota.Service.Interface
{
    public interface IFavoriteMusicService : IGenericService<FavoriteMusic, FavoriteMusicDto, CreateFavoriteMusicDto, UpdateFavoriteMusicDto>
    {
        Task<IEnumerable<FavoriteMusicDto>> GetByUserIdAsync(Guid userId);
        Task<PagedResult<FavoriteMusicDto>> GetPagedByUserIdAsync(Guid userId, int pageNumber, int pageSize);
        Task<IEnumerable<FavoriteMusicDto>> SearchAsync(Guid userId, string searchTerm);
        Task<FavoriteMusicDto?> GetByIdAndUserIdAsync(Guid id, Guid userId);
        Task<FavoriteMusicDto> CreateForUserAsync(CreateFavoriteMusicDto createDto, Guid userId);
        Task<FavoriteMusicDto?> UpdateByIdAndUserIdAsync(Guid id, UpdateFavoriteMusicDto updateDto, Guid userId);
        Task<bool> DeleteByIdAndUserIdAsync(Guid id, Guid userId);
    }
}
