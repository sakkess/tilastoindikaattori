import './App.css';

function App() {
  const columnHeadings = [
    'Tosi huono vihje',
    'Semi huono vihje',
    'Tarvitsee kovasti vihjeitä',
    'Tarvitsee semisti vihjeitä',
    'Tosi huono mallivastaus',
    'Semi huono mallivastaus',
    'Nosta vaikeustasoa yhdellä',
    'Laske vaikeustasoa yhdellä',
  ];

  return (
    <main className="app">
      <h1>Tilastoindikaattorit</h1>
      <form className="upload" aria-label="CSV upload">
        <label htmlFor="csv-upload">Lataa CSV-tiedosto</label>
        <input id="csv-upload" type="file" accept=".csv" />
      </form>

      <section className="hint-table" aria-labelledby="hint-table-heading">
        <div className="section-header">
          <h2 id="hint-table-heading">Vihje- ja mallivastaustaulukko</h2>
          <p>
            Tässä taulukossa voit tarkastella eri vihje- ja vaikeustasoluokkia. Lisää
            dataa lataamalla CSV-tiedoston tai syöttämällä rivejä myöhemmin.
          </p>
        </div>

        <div className="table-wrapper" role="region" aria-live="polite">
          <table>
            <thead>
              <tr>
                {columnHeadings.map((heading) => (
                  <th key={heading} scope="col">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columnHeadings.length} className="empty-state">
                  Ei vielä rivejä. Lataa CSV tai lisää tietoja myöhemmin.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
