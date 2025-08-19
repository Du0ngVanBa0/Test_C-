using Sapota.Model;

namespace Sapota.Repository.Interface
{
    public interface IRefreshTokenRepository : IGenericRepository<RefreshToken>
    {
        Task<RefreshToken?> GetValidTokenAsync(string token);
        Task<RefreshToken?> GetByTokenAsync(string token);
        Task<IEnumerable<RefreshToken>> GetUserActiveTokensAsync(Guid userId);
        Task RevokeUserTokensAsync(Guid userId);
        Task RevokeTokenAsync(string token);
        Task CleanupExpiredTokensAsync();
    }
}
