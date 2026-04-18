# Contributing to RepoDoctor AI

Thank you for your interest in contributing to RepoDoctor AI! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/repodoctor-ai.git`
3. Create a new branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Set up database
npx prisma migrate dev

# Run development server
npm run dev
```

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Run `npm run lint` before committing
- Ensure all tests pass

## Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure your code follows our style guidelines
3. Include relevant tests
4. Update documentation as needed
5. Link any related issues

## Reporting Issues

When reporting issues, please include:

- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

## Security Issues

Please do not open public issues for security vulnerabilities. Instead, email security concerns to the maintainers directly.

## Code of Conduct

Be respectful and constructive in all interactions. We aim to maintain a welcoming community for everyone.

## Questions?

Feel free to open an issue for questions or join our discussions.

Thank you for contributing!
