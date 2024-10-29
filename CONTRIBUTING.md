# Contributing to Telehealth Demo

## Local Development Setup

### Prerequisites
- Docker Desktop
- Git
- A JaaS account with API credentials
  > Don't have JaaS credentials? [Sign up here](https://jaas.8x8.vc/signup?jaas=true)

### Setup Steps

1. Fork and Clone
```bash
# Fork this repository first, then clone your fork
git clone https://github.com/yourusername/telehealth-demo.git
cd telehealth-demo
```

2. Environment Setup
```bash
# Copy the example env file
cp .env.example .env.local

# Edit .env.local with your JaaS credentials
NEXT_PUBLIC_JAAS_APP_ID=your-jaas-app-id
JAAS_PRIVATE_KEY="your-private-key"
```

3. Development Options

Using Docker (Recommended):
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or run in detached mode
docker-compose up -d
```

Using Local Node.js:
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

4. Access the application at `http://localhost:3000`

## Project Structure
```
├── app/                  # Next.js app router
│   ├── page.tsx         # Home page
│   ├── schedule/        # Schedule page
│   ├── patients/        # Patients page
│   └── settings/        # Settings page
├── components/          # React components
│   ├── ui/             # UI components from shadcn
│   └── ...             # Feature components
├── lib/                # Utilities
│   └── jitsi-utils.ts  # JaaS integration
└── public/             # Static assets
    └── docs/           # Documentation images
```

## Making Changes

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and test thoroughly

3. Commit your changes:
```bash
git add .
git commit -m "feat: description of your changes"
```

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request

## Pull Request Guidelines

- Follow existing code style
- Include clear description of changes
- Update documentation if needed
- Test your changes thoroughly
- Keep PRs focused on a single change

## Need Help?

Feel free to open an issue for:
- Bug reports
- Feature requests
- Questions about the codebase

## License

By contributing, you agree that your contributions will be licensed under the MIT License.