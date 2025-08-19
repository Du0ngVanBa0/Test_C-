using Microsoft.EntityFrameworkCore;
using Sapota.Model;
using Sapota.Repository.Interface;

namespace Sapota.Repository.Implement
{
    public class RefreshTokenRepository : GenericRepository<RefreshToken>, IRefreshTokenRepository
    {
        public RefreshTokenRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<RefreshToken?> GetValidTokenAsync(string token)
        {
            return await _dbSet
                .FirstOrDefaultAsync(rt => rt.Token == token &&
                                         !rt.IsRevoked &&
                                         rt.ExpiryDate > DateTime.UtcNow);
        }

        public async Task<RefreshToken?> GetByTokenAsync(string token)
        {
            return await _dbSet
                .FirstOrDefaultAsync(rt => rt.Token == token);
        }

        public async Task<IEnumerable<RefreshToken>> GetUserActiveTokensAsync(Guid userId)
        {
            return await _dbSet
                .Where(rt => rt.UserId == userId &&
                           !rt.IsRevoked &&
                           rt.ExpiryDate > DateTime.UtcNow)
                .ToListAsync();
        }

        public async Task RevokeUserTokensAsync(Guid userId)
        {
            var tokens = await _dbSet
                .Where(rt => rt.UserId == userId && !rt.IsRevoked)
            .ToListAsync();

            foreach (var token in tokens)
            {
                token.IsRevoked = true;
            }

            await _context.SaveChangesAsync();
        }

        public async Task RevokeTokenAsync(string token)
        {
            var refreshToken = await GetByTokenAsync(token);
            if (refreshToken != null)
            {
                refreshToken.IsRevoked = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task CleanupExpiredTokensAsync()
        {
            var expiredTokens = await _dbSet
                .Where(rt => rt.ExpiryDate <= DateTime.UtcNow)
                .ToListAsync();

            _dbSet.RemoveRange(expiredTokens);
            await _context.SaveChangesAsync();
        }
    }
}
