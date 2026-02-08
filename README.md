[![progress-banner](https://backend.codecrafters.io/progress/http-server/f8386bf6-624d-469c-bcad-db472f900aca)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)

# 🌐 HTTP/1.1 Server Implementation in TypeScript

A lightweight implementation HTTP/1.1 server built from scratch in Node.js. This project handles multiple concurrent clients, supports persistent connections, file operations, compression, and follows HTTP/1.1 specifications.

Built as part of the [CodeCrafters](https://codecrafters.io) "Build your own HTTP Server" challenge.

## 📋 Overview

This HTTP server is built on top of Node.js's TCP `net` module, implementing the HTTP/1.1 protocol from the ground up. It demonstrates core networking concepts including:

- TCP socket management
- HTTP request/response parsing and formatting
- Persistent connections (HTTP keep-alive)
- Content negotiation and compression
- File system operations
- Concurrent client handling

## ✨ Features

### 🔌 **HTTP/1.1 Protocol Support**

- Full request parsing (method, path, headers, body)
- Proper response formatting with status codes
- Persistent connections (keep-alive)
- Connection management (`Connection: close` header support)
- Content-Length based body parsing

### 📦 **Content Encoding**

- **gzip compression** for responses
- Content negotiation via `Accept-Encoding` header
- Automatic compression for `/echo` endpoints

### 📁 **File Operations**

- **GET** `/files/{filename}` - Read files from disk
- **POST** `/files/{filename}` - Write files to disk
- Configurable directory via `--directory` flag
- Proper MIME types (`application/octet-stream`)

### 🔄 **Request Handling**

- **GET** `/` - Root endpoint
- **GET** `/echo/{value}` - Echo back arbitrary strings
- **GET** `/user-agent` - Return User-Agent header
- **GET** `/files/{filename}` - Serve static files
- **POST** `/files/{filename}` - Upload files

## 🚀 Getting Started

### Prerequisites

- **Bun** 1.1 or higher ([Install Bun](https://bun.sh))
- Basic understanding of HTTP and TCP networking concepts

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd codecrafters-http-server-typescript
   ```

2. **Install dependencies**

   ```bash
   bun install
   ```

3. **Run locally**

   ```bash
   ./your_program.sh
   ```

   Or with a custom directory for file operations:

   ```bash
   ./your_program.sh --directory /path/to/serve/files
   ```

   The server will start on `http://localhost:4221`.

### Available Commands

Force stop the server:

```bash
bun kill
```

## 🎯 Supported Routes

| Method | Path | Description | Response |
| ------ | ---- | ----------- | -------- |
| GET | `/` | Root endpoint | 200 OK |
| GET | `/echo/{value}` | Echo back the value | 200 OK with value |
| GET | `/user-agent` | Return User-Agent header | 200 OK with user agent |
| GET | `/files/{filename}` | Read file from disk | 200 OK with file content or 404 |
| POST | `/files/{filename}` | Write file to disk | 201 Created or 500 |
| * | Any other | Not found | 404 Not Found |

## 🧪 Testing

### Codecrafters

Run tests against the CodeCrafters CLI:

```sh
codecrafters test
```

### Manual Testing

**Basic endpoints:**

```bash
# Root
curl -v http://localhost:4221/

# Echo
curl -v http://localhost:4221/echo/hello

# User-Agent
curl -v http://localhost:4221/user-agent -H "User-Agent: MyTestAgent/1.0"
```

**File endpoints:**

```bash
# Create a file
curl -v -X POST http://localhost:4221/files/hello.txt -H "Content-Length: 11" -H "Content-Type: application/octet-stream" -d 'hello world'

# Read the file
curl -v http://localhost:4221/files/hello.txt
```

**Compression header:**

```bash
curl -v http://localhost:4221/echo/compress-me -H "Accept-Encoding: gzip"
```

### Local Testing

Pull codecrafters `http-server-tester` submodule:

  ```sh
  git submodule update --init --recursive
  ```

Build `http-server-tester` binary

  ```sh
  bun test:build
  ```

Install dependencies

  ```sh
  bun install
  ```

Create `.env` and set `CURRENT_STAGE` variable

  ```sh
  echo "CURRENT_STAGE=1" > .env
  ```

Run codecrafters tests locally

  ```sh
  bun test codecrafters
  ```
