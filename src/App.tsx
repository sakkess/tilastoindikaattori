import { type ChangeEvent, useState } from 'react';
import './App.css';

type ParsedRow = {
  exercise: string;
  difficulty: number;
  noOfHint: number;
  percentHint: number;
  percentWrong: number;
};

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

const parseNumber = (value: string) => Number(value.replace(',', '.'));

const parseCsv = (text: string) => {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    throw new Error('CSV-tiedosto ei sisällä rivejä datalle.');
  }

  const [headerLine, ...dataLines] = lines;
  const headers = headerLine.split(',').map((header) => header.trim().toLowerCase());

  const headerIndex = (name: string) => headers.indexOf(name.toLowerCase());
  const exerciseIndex = headerIndex('exercise');
  const difficultyIndex = headerIndex('difficulty');
  const noOfHintIndex = headerIndex('no_of_hint');
  const percentHintIndex = headerIndex('percent_hint');
  const percentWrongIndex = headerIndex('percent_wrong');

  if ([exerciseIndex, difficultyIndex, noOfHintIndex, percentHintIndex, percentWrongIndex].includes(-1)) {
    throw new Error('CSV-tiedostosta puuttuu vaadittuja sarakkeita.');
  }

  return dataLines.map<ParsedRow>((line) => {
    const columns = line.split(',');

    return {
      exercise: columns[exerciseIndex]?.trim() ?? '',
      difficulty: parseNumber(columns[difficultyIndex] ?? '0'),
      noOfHint: parseNumber(columns[noOfHintIndex] ?? '0'),
      percentHint: parseNumber(columns[percentHintIndex] ?? '0'),
      percentWrong: parseNumber(columns[percentWrongIndex] ?? '0'),
    };
  });
};

const isMatchingRow = (row: ParsedRow) => {
  if (!row.exercise || row.noOfHint <= 0 || row.percentWrong === 0) {
    return false;
  }

  const ratio = row.percentHint / row.percentWrong;

  if (row.difficulty === 1) {
    return ratio > 0.4 && ratio < 0.8;
  }

  if (row.difficulty === 2) {
    return ratio > 0.3 && ratio < 0.6;
  }

  if (row.difficulty === 3) {
    return ratio > 0.2 && ratio < 0.4;
  }

  if (row.difficulty === 4) {
    return ratio > 0.1 && ratio < 0.2;
  }

  return false;
};

function App() {
  const [matchingExercises, setMatchingExercises] = useState<string[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>('Ei vielä rivejä. Lataa CSV tai lisää tietoja myöhemmin.');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      const matches = rows.filter(isMatchingRow).map((row) => row.exercise);

      setMatchingExercises(matches);
      setUploadMessage(matches.length === 0 ? 'Ehtoja vastaavia rivejä ei löytynyt.' : 'Lataus onnistui. Ehtoja vastaavat rivit on listattu taulukossa.');
    } catch (error) {
      setMatchingExercises([]);
      setUploadMessage(error instanceof Error ? error.message : 'CSV-tiedoston käsittely epäonnistui.');
    }
  };

  return (
    <main className="app">
      <h1>Tilastoindikaattorit</h1>
      <form className="upload" aria-label="CSV upload">
        <label htmlFor="csv-upload">Lataa CSV-tiedosto</label>
        <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
        <p className="upload-status" role="status">
          {uploadMessage}
        </p>
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
              {matchingExercises.length === 0 ? (
                <tr>
                  <td colSpan={columnHeadings.length} className="empty-state">
                    {uploadMessage}
                  </td>
                </tr>
              ) : (
                matchingExercises.map((exercise) => (
                  <tr key={exercise}>
                    {columnHeadings.map((heading) => {
                      const isSemiHuonoVihje = heading === 'Semi huono vihje';
                      const cellContent = isSemiHuonoVihje ? exercise : '';
                      const ariaLabel = `${heading}${cellContent ? `: ${cellContent}` : ' (ei dataa)'}`;

                      return (
                        <td key={`${exercise}-${heading}`} aria-label={ariaLabel}>
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
