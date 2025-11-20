import './App.css';

function App() {
  return (
    <main className="app">
      <header className="hero">
        <p className="eyebrow">Tilastoindikaattori</p>
        <h1>Welcome to your React + TypeScript workspace</h1>
        <p className="lede">
          Start building the statistical indicator UI by editing <code>src/App.tsx</code> and
          connecting data sources through your preferred client libraries.
        </p>
        <div className="cta-row">
          <a className="button" href="https://vitejs.dev/guide/" target="_blank" rel="noreferrer">
            Vite guide
          </a>
          <a className="button secondary" href="https://react.dev/learn" target="_blank" rel="noreferrer">
            React docs
          </a>
        </div>
      </header>

      <section className="panel-grid">
        <article className="panel">
          <h2>Project commands</h2>
          <ul>
            <li>
              <code>npm run dev</code> — start the dev server with hot module reload
            </li>
            <li>
              <code>npm run build</code> — type-check and create an optimized production bundle
            </li>
            <li>
              <code>npm run preview</code> — serve the built bundle locally for verification
            </li>
            <li>
              <code>npm run lint</code> — run ESLint against TypeScript and React files
            </li>
          </ul>
        </article>

        <article className="panel">
          <h2>Next steps</h2>
          <ul>
            <li>Replace this placeholder with your landing layout or dashboard shell.</li>
            <li>Add routing, state management, and API clients as your data needs evolve.</li>
            <li>Wire UI components to live data once credentials are available.</li>
            <li>Configure testing (e.g., Vitest, React Testing Library) before shipping features.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}

export default App;
