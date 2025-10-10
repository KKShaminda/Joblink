using JobLink.API.Models.DTOs;

namespace JobLink.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto> LoginAsync(LoginDto loginDto);
        Task<UserDto?> GetUserByIdAsync(int userId);
        string GenerateJwtToken(Models.Entities.User user);
    }
}