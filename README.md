# Bingo Game

A modern Bingo game built with Vite, React, TypeScript, and Tailwind CSS.

## Tech Stack

- [Vite](https://vitejs.dev/) for fast development and build
- [React 18+](https://react.dev/) for UI
- [TypeScript](https://www.typescriptlang.org/) for type safety
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) for code quality and formatting

## Getting Started

1. **Install dependencies**
   ```sh
   npm install
   ```
2. **Start development server**
   ```sh
   npm run dev
   ```
3. **Build for production**
   ```sh
   npm run build
   ```
4. **Preview production build**
   ```sh
   npm run preview
   ```
5. **Lint code**
   ```sh
   npm run lint
   ```

## Project Structure

```
├── src
│   ├── components    # React components
│   ├── types         # TypeScript types & interfaces
│   ├── utils         # Utility functions
│   ├── App.tsx       # Main App component
│   ├── App.css       # App-specific styles
│   ├── index.css     # Global styles (Tailwind)
│   └── main.tsx      # React entry point
├── index.html        # Main HTML entry
├── package.json      # Project metadata & scripts
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript config
├── tsconfig.node.json# Node-specific TS config
├── tailwind.config.js# Tailwind CSS config
├── postcss.config.js # PostCSS config
├── .eslintrc.cjs     # ESLint config
├── .prettierrc       # Prettier config
├── .gitignore        # Git ignore rules
└── README.md         # Project documentation
```

## Development Guidelines

- Use Tailwind CSS for styling whenever possible
- Keep components small and reusable
- Use TypeScript for all code
- Run `npm run lint` and `npm run format` before committing to ensure code quality and consistent formatting

## License

MIT
