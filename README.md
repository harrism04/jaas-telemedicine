# Telehealth Demo with JaaS Integration

A telehealth platform built with Next.js and JaaS (Jitsi as a Service) for video conferencing.

## Screenshots

### Dashboard
![Dashboard View](public/docs/dashboard.png)
*Main dashboard showing appointments and waiting room*

### Doctor's Interface
![Doctor's View](public/docs/doctor-view.png)
*Doctor's video consultation interface with patient information*

### Patient's Interface
![Patient's View](public/docs/patient-view.png)
*Patient's simplified video consultation interface*

## Features

- Real-time video consultations
- Doctor and patient views
- Waiting room functionality
- Patient information display
- Chat functionality (mock)
- Responsive design

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- A JaaS account with:
  - App ID
  - Private Key
  > Don't have JaaS credentials? [Sign up here](https://jaas.8x8.vc/signup?jaas=true)
- npm or yarn package manager

## Environment Setup

1. Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_JAAS_APP_ID=your-jaas-app-id
JAAS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your-private-key-content
-----END PRIVATE KEY-----"
```

2. Make sure your private key is properly formatted with:
- Correct BEGIN and END markers
- Line breaks after every 64 characters
- No extra spaces or characters

## Docker Setup

### Using Docker Compose (Recommended)
```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### Using Docker directly
```bash
# Build the image
docker build -t telehealth-demo .

# Run the container
docker run -p 3000:3000 --env-file .env.local telehealth-demo
```

The application will be available at `http://localhost:3000`

For development with Docker:
```bash
# Build and run with volume mounting for development
docker run -p 3000:3000 --env-file .env.local -v $(pwd):/app telehealth-demo npm run dev
```

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The application will be available at `http://localhost:3000`

## Usage

1. Open the dashboard to see the list of appointments
2. Click "Start Consultation" on any appointment
3. Use the demo controls to:
   - Open doctor view
   - Launch patient view
4. Test the video consultation features

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui
- JaaS (8x8's Jitsi as a Service)
- jsrsasign for JWT handling
- Docker

## Project Structure

```
├── app/                  # Next.js app router
├── components/          # React components
│   ├── ui/             # UI components
│   └── ...             # Feature components
├── lib/                # Utilities and helpers
└── public/             # Static assets
    └── docs/           # Documentation images
```

## Contributing

This is a demo project to showcase JaaS iFrame API capabilities, but suggestions and improvements are welcome. Feel free to:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

[MIT License](LICENSE)
