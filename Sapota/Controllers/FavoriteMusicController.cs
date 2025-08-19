using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sapota.DTO.Music;
using Sapota.DTO;
using Sapota.Model;
using Sapota.Service.Interface;
using System.Security.Claims;

namespace Sapota.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FavoriteMusicController : ControllerBase
    {
        private readonly IFavoriteMusicService _favoriteMusicService;

        public FavoriteMusicController(IFavoriteMusicService favoriteMusicService)
        {
            _favoriteMusicService = favoriteMusicService;
        }

        private Guid GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                throw new UnauthorizedAccessException("User ID not found in token");
            }
            return userId;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FavoriteMusicDto>>> GetAll()
        {
            var userId = GetCurrentUserId();
            var favoriteMusics = await _favoriteMusicService.GetByUserIdAsync(userId);
            return Ok(favoriteMusics);
        }

        [HttpGet("paged")]
        public async Task<ActionResult<PagedResult<FavoriteMusicDto>>> GetPaged(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            var userId = GetCurrentUserId();
            var result = await _favoriteMusicService.GetPagedByUserIdAsync(userId, pageNumber, pageSize);
            return Ok(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FavoriteMusicDto>>> Search([FromQuery] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
                return BadRequest("Search term cannot be empty");

            var userId = GetCurrentUserId();
            var favoriteMusics = await _favoriteMusicService.SearchAsync(userId, searchTerm);
            return Ok(favoriteMusics);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FavoriteMusicDto>> GetById(Guid id)
        {
            var userId = GetCurrentUserId();
            var favoriteMusic = await _favoriteMusicService.GetByIdAndUserIdAsync(id, userId);

            if (favoriteMusic == null)
                return NotFound();

            return Ok(favoriteMusic);
        }

        [HttpPost]
        public async Task<ActionResult<FavoriteMusicDto>> Create(CreateFavoriteMusicDto createDto)
        {
            var userId = GetCurrentUserId();
            var favoriteMusic = await _favoriteMusicService.CreateForUserAsync(createDto, userId);
            return CreatedAtAction(nameof(GetById), new { id = favoriteMusic.Id }, favoriteMusic);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FavoriteMusicDto>> Update(Guid id, UpdateFavoriteMusicDto updateDto)
        {
            var userId = GetCurrentUserId();
            var favoriteMusic = await _favoriteMusicService.UpdateByIdAndUserIdAsync(id, updateDto, userId);

            if (favoriteMusic == null)
                return NotFound();

            return Ok(favoriteMusic);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetCurrentUserId();
            var result = await _favoriteMusicService.DeleteByIdAndUserIdAsync(id, userId);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
