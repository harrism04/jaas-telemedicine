# Contributing to Telehealth Demo

## Local Development Setup

### Prerequisites
- Docker Desktop
- Git
- A JaaS account with API credentials

### Setup Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/telehealth-demo.git
cd telehealth-demo
```

2. Create your environment file
```bash
cp .env.example .env.local
```

3. Edit `.env.local` with your JaaS credentials:
```env
NEXT_PUBLIC_JAAS_APP_ID=your-jaas-app-id
JAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your-private-key-content
-----END PRIVATE KEY-----"
```

4. Build and run with Docker
```bash
# Build the image
docker build -t telehealth-demo .

# Run the container
docker run -p 3000:3000 --env-file .env.local telehealth-demo
```

5. Access the application at `http://localhost:3000`

## Development with Hot Reload

For development with hot reload:
```bash
docker run -p 3000:3000 --env-file .env.local -v $(pwd):/app telehealth-demo npm run dev
```

## Troubleshooting

If you encounter any issues:
1. Make sure Docker is running
2. Verify your JaaS credentials are correct
3. Check the console logs for any errors 