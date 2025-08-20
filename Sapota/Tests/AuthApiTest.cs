using FluentAssertions;
using System.Text;
using Xunit;
using Newtonsoft.Json;
using System.Net;

namespace Sapota.Tests
{
    public class LiveServerTest
    {
        private readonly string _baseUrl = "http://localhost:5000";

        [Fact]
        public async Task Live_Server_Should_Be_Running()
        {
            using var client = new HttpClient();

            var response = await client.GetAsync($"{_baseUrl}/swagger/index.html");

            System.Console.WriteLine($"Live server status: {response.StatusCode}");

            response.StatusCode.Should().BeOneOf(
                HttpStatusCode.OK,
                HttpStatusCode.Redirect
            );
        }

        [Fact]
        public async Task Live_Register_API_Test()
        {
            using var client = new HttpClient();

            var registerData = new
            {
                name = "Du0ngVanBa0",
                email = $"livetest_{DateTime.Now.Ticks}@gmail.com",
                password = "123456"
            };

            var json = JsonConvert.SerializeObject(registerData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"{_baseUrl}/api/Auth/register", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            response.StatusCode.Should().Be(HttpStatusCode.OK);
        }

        [Fact]
        public async Task Live_Register_API_Test_Password_Error()
        {
            using var client = new HttpClient();

            var registerData = new
            {
                name = "Du0ngVanBa0",
                email = $"livetest_{DateTime.Now.Ticks}@gmail.com",
                password = "12345"
            };

            var json = JsonConvert.SerializeObject(registerData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"{_baseUrl}/api/Auth/register", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            responseContent.Should().Contain("Password must be at least 6 characters long.");
        }

        [Fact]
        public async Task Live_Register_API_Test_Duplicate_Email()
        {
            using var client = new HttpClient();

            var duplicatedEmail = $"duplicate_{DateTime.Now.Ticks}@gmail.com";
            var registerData = new
            {
                name = "Du0ngVanBa0",
                email = duplicatedEmail,
                password = "123456"
            };

            var json = JsonConvert.SerializeObject(registerData);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var firstResponse = await client.PostAsync($"{_baseUrl}/api/Auth/register", content);
            firstResponse.StatusCode.Should().Be(HttpStatusCode.OK);

            var secondResponse = await client.PostAsync($"{_baseUrl}/api/Auth/register", content);
            var secondContent = await secondResponse.Content.ReadAsStringAsync();

            secondResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
            secondContent.Should().Contain("Email already exists");
        }

        [Fact]
        public async Task Live_Login_API_Test()
        {
            using var client = new HttpClient();

            var registerData = new
            {
                name = "Du0ngVanBa0",
                email = $"logintest_{DateTime.Now.Ticks}@gmail.com",
                password = "123456"
            };

            var registerJson = JsonConvert.SerializeObject(registerData);
            var registerContent = new StringContent(registerJson, Encoding.UTF8, "application/json");
            await client.PostAsync($"{_baseUrl}/api/Auth/register", registerContent);

            var loginData = new
            {
                registerData.email,
                registerData.password
            };

            var loginJson = JsonConvert.SerializeObject(loginData);
            var loginContent = new StringContent(loginJson, Encoding.UTF8, "application/json");

            var response = await client.PostAsync($"{_baseUrl}/api/Auth/login", loginContent);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (response.IsSuccessStatusCode)
            {
                responseContent.Should().Contain("accessToken");
                responseContent.Should().Contain("refreshToken");
            }
        }
    }
}