# Sapota API - Music Service

## Tổng quan

#### Ứng dụng gồm có các chức năng cơ bản sau:
- CRUD Music cho mỗi người dùng
- Đăng nhập với google, dùng access và refresh token (Vẫn chưa có table để lưu revoke token).

---

## 1. Chạy bằng Docker

### Yêu cầu

- Đã cài [Docker Desktop](https://www.docker.com/products/docker-desktop/) hoặc Docker Engine.

### Các bước thực hiện

#### **Bước 1:** Clone mã nguồn

```sh
https://github.com/Du0ngVanBa0/Test_C-
```

#### **Bước 2:** Khởi động dịch vụ bằng Docker Compose

```sh
docker compose up --build
```

> Lệnh này sẽ tự động build API và khởi tạo MySQL kèm dữ liệu mẫu từ file `init.sql`.

#### **Bước 3:** Truy cập API

- Swagger UI (API docs): [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html)

#### **Bước 4:** Tài khoản mặc định

Nếu có file `init.sql`, bạn có thể tạo user mặc định, ví dụ:

```sql
-- init.sql ví dụ
INSERT INTO Users (Id, Name, Email, PasswordHash, ...) VALUES (...);
```

---

## 2. Chạy **KHÔNG cần Docker** (chạy trực tiếp)

### Yêu cầu

- Cài đặt [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) (**không cần cài Visual Studio**)
- Cài đặt MySQL (có thể dùng [XAMPP](https://www.apachefriends.org/download.html), [MySQL Installer](https://dev.mysql.com/downloads/installer/), hoặc [MariaDB](https://mariadb.org/download/))

### Các bước thực hiện

#### **Bước 1:** Clone mã nguồn

```sh
git clone https://github.com/Du0ngVanBa0/Test_C-
```

#### **Bước 2:** Khởi tạo cơ sở dữ liệu

- Tạo database `music` trong MySQL (có thể dùng phpMyAdmin hoặc dòng lệnh):

```sql
CREATE DATABASE music;
```

- (Tùy chọn) Import file `init.sql` nếu có để tạo bảng và dữ liệu mẫu.

#### **Bước 3:** Chỉnh sửa cấu hình kết nối

Mở file `appsettings.json` và sửa lại chuỗi kết nối cho đúng thông tin MySQL của bạn:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=music;Uid=root;Pwd=vanbao123;"
}
```

#### **Bước 4:** Build và chạy API

```sh
dotnet restore
dotnet build
dotnet run --project ./Sapota/Sapota.csproj
```

- Nếu muốn đổi port, chỉnh file `launchSettings.json` hoặc dùng biến môi trường `ASPNETCORE_URLS`

---

## 3. Kiểm tra hoạt động

- Truy cập [http://localhost:5000/swagger/index.html](http://localhost:5000/swagger/index.html) để thử các API (đăng ký, đăng nhập, thêm bài hát, ...).
- Có thể dùng [Postman](https://www.postman.com/downloads/) hoặc `curl` để kiểm tra nhanh:

```sh
curl -X POST http://localhost:5000/api/Auth/register -H "Content-Type: application/json" -d '{"name":"TestUser","email":"test@gmail.com","password":"123456"}'
```

---

## 4. Cấu trúc các file chính

- `docker-compose.yml` – cấu hình dịch vụ Docker
- `appsettings.json` – cấu hình chuỗi kết nối, JWT, logging
- `init.sql` – script khởi tạo DB (tùy chọn)
- `Sapota.csproj` – file cài đặt các package nuget
- `Controllers/` – chứa các API controller
- `Repository/`, `Model/`, `Service/` – mã nguồn chính backend

---

## 5. Chạy unit test

#### **Bước 1:** Vào thư mục FE

```sh
cd Sapota
```
#### **Bước 2:** Test

```sh
dotnet test
```

# Music FE
## Chạy FE với thư mục `test-sapota_fe`

### Yêu cầu

- Đã cài [Node.js](https://nodejs.org/en/download/) (>= v18)
- Đã cài [pnpm](https://pnpm.io/installation) hoặc [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)


### Các bước thực hiện

#### **Bước 1:** Vào thư mục FE

```sh
cd test-sapota_fe
```

#### **Bước 2:** Cài dependencies

```sh
pnpm install
# hoặc npm install
```

#### **Bước 3:** Nếu muốn đổi clientId thì sửa file `.env` (trong thư mục test-sapota_fe)

```env
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
```

#### **Bước 4:** Chạy FE (Vite)

```sh
pnpm dev
# npm run dev
# vite
```

- FE mặc định chạy tại [http://localhost:5173](http://localhost:5173)  
  (hoặc cổng do Vite báo)
