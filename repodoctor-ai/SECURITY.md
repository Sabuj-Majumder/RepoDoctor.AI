# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in RepoDoctor AI, please report it responsibly.

**Do NOT open a public issue.**

Instead, please:

1. Email the maintainers directly with details
2. Include steps to reproduce the vulnerability
3. Allow time for the issue to be addressed before public disclosure

We take security seriously and will respond to reports within 48 hours.

## Security Measures

RepoDoctor AI implements several security measures:

- Input validation and sanitization
- Rate limiting on API endpoints
- UUID validation for database queries
- No secrets committed to the repository
- Dependency vulnerability scanning

## Best Practices for Users

- Keep your dependencies updated
- Use environment variables for sensitive data
- Enable GitHub token for higher rate limits
- Regularly audit your own repositories

## Security Updates

Security updates will be released as patch versions and announced in our changelog.
