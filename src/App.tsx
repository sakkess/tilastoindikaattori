import './App.css';

function App() {
  return (
    <main className="app">
      <h1>Tilastoindikaattorit</h1>
      <form className="upload" aria-label="CSV upload">
        <label htmlFor="csv-upload">Lataa CSV-tiedosto</label>
        <input id="csv-upload" type="file" accept=".csv" />
      </form>
    </main>
  );
}

export default App;
