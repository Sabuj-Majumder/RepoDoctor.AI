# RepoDoctor AI

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma" alt="Prisma">
</p>

<p align="center">
  <strong>AI-Powered GitHub Repository Health Analyzer</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#scoring">Scoring</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## Features

- **Comprehensive Analysis**: 5-category scoring system covering README, structure, activity, maintainability, and best practices
- **AI-Powered Insights**: Optional local LLM integration via Ollama for intelligent recommendations
- **Beautiful Visualizations**: Interactive radar charts and score breakdowns
- **Export Options**: Download PDF reports or copy Markdown summaries
- **History Tracking**: SQLite database stores past analyses
- **Dark Mode UI**: Premium dark-themed interface with glass morphism effects

## Demo

![RepoDoctor AI Screenshot](https://via.placeholder.com/800x400/000000/FFFFFF?text=RepoDoctor+AI+Screenshot)

### Example Reports

Try analyzing these popular repositories:
- [vercel/next.js](https://github.com/vercel/next.js)
- [facebook/react](https://github.com/facebook/react)
- [tailwindlabs/tailwindcss](https://github.com/tailwindlabs/tailwindcss)

## Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- (Optional) [Ollama](https://ollama.com) for AI features

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/repodoctor-ai.git
cd repodoctor-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
npx prisma migrate dev
```

4. (Optional) Configure Ollama for AI features:
```bash
# Install Ollama from https://ollama.com
ollama pull llama3
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Analyzing a Repository

1. Navigate to the **Analyze** page
2. Enter a GitHub repository URL (e.g., `https://github.com/owner/repo`)
3. Click **Analyze** and wait for the results
4. View your comprehensive health report

### Understanding Your Score

Repos are scored out of **100 points** across 5 categories:

| Category | Points | Criteria |
|----------|--------|----------|
| README Quality | 20 | Title, description, install steps, usage, badges, contributing section |
| Project Structure | 20 | src/, tests/, docs/, examples/, config files |
| Activity | 20 | Recent commits, issue ratio, releases, contributors |
| Maintainability | 20 | File sizes, documentation, naming conventions |
| Best Practices | 20 | LICENSE, .gitignore, CI/CD, security policy, templates |

### Exporting Reports

- **PDF**: Click the "PDF" button on any report to download
- **Markdown**: Click "Markdown" to copy a formatted report to clipboard

## Scoring

### Score Interpretation

| Score | Rating | Description |
|-------|--------|-------------|
| 90-100 | Excellent | Production-ready with great documentation |
| 75-89 | Good | Solid foundation with minor improvements needed |
| 60-74 | Fair | Usable but needs attention in several areas |
| 40-59 | Needs Work | Significant improvements recommended |
| 0-39 | Poor | Major overhaul required |

### AI Integration

RepoDoctor AI can use local LLMs via Ollama for enhanced analysis:

1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull llama3`
3. Start Ollama server
4. RepoDoctor will automatically detect and use it

If Ollama is not available, the app falls back to rule-based analysis.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma](https://www.prisma.io/) + SQLite
- **Charts**: [Recharts](https://recharts.org/)
- **PDF Export**: [jsPDF](https://github.com/parallax/jsPDF)
- **AI**: [Ollama](https://ollama.com/) (optional)

## Roadmap

- [ ] Compare two repositories side-by-side
- [ ] Repository leaderboard
- [ ] Chrome extension
- [ ] GitHub Action integration
- [ ] VSCode extension
- [ ] Auto PR suggestions
- [ ] Team/organization analytics
- [ ] Trend analysis over time

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with modern open-source technologies
- Inspired by the need for better repository health visibility
- Thanks to all contributors and the open-source community

---

<p align="center">
  Made with ❤️ for the open source community
</p>
