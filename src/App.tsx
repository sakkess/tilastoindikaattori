import { type ChangeEvent, useState } from 'react';
import './App.css';

type ParsedRow = {
  exercise: string;
  difficulty: number;
  noOfHint: number;
  percentHint: number;
  percentWrong: number;
  total: number;
  wrong: number;
  right: number;
  hint: number;
  notUnderstood: number;
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

const createEmptyColumnData = () =>
  columnHeadings.reduce(
    (acc, heading) => ({
      ...acc,
      [heading]: [],
    }),
    {} as Record<string, string[]>,
  );

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
  const totalIndex = headerIndex('total');
  const wrongIndex = headerIndex('wrong');
  const rightIndex = headerIndex('right');
  const hintIndex = headerIndex('hint');
  const notUnderstoodIndex = headerIndex('not_understood');

  if (
    [
      exerciseIndex,
      difficultyIndex,
      noOfHintIndex,
      percentHintIndex,
      percentWrongIndex,
      totalIndex,
      wrongIndex,
      rightIndex,
      hintIndex,
      notUnderstoodIndex,
    ].includes(-1)
  ) {
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
      total: parseNumber(columns[totalIndex] ?? '0'),
      wrong: parseNumber(columns[wrongIndex] ?? '0'),
      right: parseNumber(columns[rightIndex] ?? '0'),
      hint: parseNumber(columns[hintIndex] ?? '0'),
      notUnderstood: parseNumber(columns[notUnderstoodIndex] ?? '0'),
    };
  });
};

const hasBaseRequirements = (row: ParsedRow) =>
  Boolean(row.exercise) && row.noOfHint > 0 && row.percentWrong !== 0 && row.total > 19 && row.wrong + row.hint > 9;

const tarvitseeKovastiVihjeita = (row: ParsedRow) => {
  if (!row.exercise || row.noOfHint !== 0 || row.total <= 19 || row.total === 0) {
    return false;
  }

  const ratio = row.wrong / row.total;

  if (row.difficulty === 1) {
    return ratio > 0.4;
  }

  if (row.difficulty === 2) {
    return ratio > 0.566;
  }

  if (row.difficulty === 3) {
    return ratio > 0.693;
  }

  if (row.difficulty === 4) {
    return ratio > 0.8;
  }

  return false;
};

const tarvitseeSemistiVihjeita = (row: ParsedRow) => {
  if (!row.exercise || row.noOfHint !== 0 || row.total <= 19 || row.total === 0) {
    return false;
  }

  const ratio = row.wrong / row.total;

  if (row.difficulty === 1) {
    return ratio > 0.2 && ratio <= 0.4;
  }

  if (row.difficulty === 2) {
    return ratio > 0.283 && ratio <= 0.566;
  }

  if (row.difficulty === 3) {
    return ratio > 0.346 && ratio <= 0.693;
  }

  if (row.difficulty === 4) {
    return ratio > 0.4 && ratio <= 0.8;
  }

  return false;
};

const isTosiHuonoHint = (row: ParsedRow) => {
  if (!hasBaseRequirements(row)) {
    return false;
  }

  const ratio = row.percentHint / row.percentWrong;

  if (row.difficulty === 1) {
    return ratio < 0.4;
  }

  if (row.difficulty === 2) {
    return ratio < 0.3;
  }

  if (row.difficulty === 3) {
    return ratio < 0.2;
  }

  if (row.difficulty === 4) {
    return ratio < 0.1;
  }

  return false;
};

const isSemiHuonoHint = (row: ParsedRow) => {
  if (!hasBaseRequirements(row)) {
    return false;
  }

  const ratio = row.percentHint / row.percentWrong;

  if (row.difficulty === 1) {
    return ratio >= 0.4 && ratio < 0.8;
  }

  if (row.difficulty === 2) {
    return ratio >= 0.3 && ratio < 0.6;
  }

  if (row.difficulty === 3) {
    return ratio >= 0.2 && ratio < 0.4;
  }

  if (row.difficulty === 4) {
    return ratio >= 0.1 && ratio < 0.2;
  }

  return false;
};

const isTosiHuonoMallivastaus = (row: ParsedRow) => {
  if (row.wrong === 0 || row.total <= 19) {
    return false;
  }

  return row.notUnderstood / row.wrong > 0.5;
};

const isSemiHuonoMallivastaus = (row: ParsedRow) => {
  if (row.wrong <= 0 || row.total <= 19) {
    return false;
  }

  return row.notUnderstood / row.wrong > 0.35;
};

const shouldRaiseDifficulty = (row: ParsedRow) => {
  if (row.total <= 19) {
    return false;
  }

  const wrongRatio = row.wrong / row.total;
  const rightRatio = row.right / row.total;

  if (row.difficulty === 1) {
    return wrongRatio > 0.3 && rightRatio < 0.5;
  }

  if (row.difficulty === 2) {
    return wrongRatio > 0.6 && rightRatio < 0.3;
  }

  if (row.difficulty === 3) {
    return wrongRatio > 0.9 && rightRatio < 0.1;
  }

  return false;
};

function App() {
  const [columnData, setColumnData] = useState<Record<string, string[]>>(createEmptyColumnData());
  const [uploadMessage, setUploadMessage] = useState<string>('Ei vielä rivejä. Lataa CSV tai lisää tietoja myöhemmin.');

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const rows = parseCsv(text);
      const tosiHuonoHints = rows.filter(isTosiHuonoHint).map((row) => row.exercise);
      const semiHuonoHints = rows.filter(isSemiHuonoHint).map((row) => row.exercise);
      const semistiVihjeita = rows.filter(tarvitseeSemistiVihjeita).map((row) => row.exercise);
      const paljonVihjeita = rows.filter(tarvitseeKovastiVihjeita).map((row) => row.exercise);
      const nostaaVaikeustasoa = rows.filter(shouldRaiseDifficulty).map((row) => row.exercise);
      const tosiHuonotMallivastaukset = rows
        .filter(isTosiHuonoMallivastaus)
        .map((row) => row.exercise);
      const semiHuonotMallivastaukset = rows
        .filter(isSemiHuonoMallivastaus)
        .map((row) => row.exercise);

      const updatedColumnData = {
        ...createEmptyColumnData(),
        'Tosi huono vihje': tosiHuonoHints,
        'Semi huono vihje': semiHuonoHints,
        'Tarvitsee semisti vihjeitä': semistiVihjeita,
        'Tarvitsee kovasti vihjeitä': paljonVihjeita,
        'Nosta vaikeustasoa yhdellä': nostaaVaikeustasoa,
        'Tosi huono mallivastaus': tosiHuonotMallivastaukset,
        'Semi huono mallivastaus': semiHuonotMallivastaukset,
      };

      setColumnData(updatedColumnData);

      const totalMatches =
        tosiHuonoHints.length +
        semiHuonoHints.length +
        semistiVihjeita.length +
        paljonVihjeita.length +
        nostaaVaikeustasoa.length +
        tosiHuonotMallivastaukset.length +
        semiHuonotMallivastaukset.length;
      setUploadMessage(totalMatches === 0 ? 'Ehtoja vastaavia rivejä ei löytynyt.' : 'Lataus onnistui. Ehtoja vastaavat rivit on listattu taulukossa.');
    } catch (error) {
      setColumnData(createEmptyColumnData());
      setUploadMessage(error instanceof Error ? error.message : 'CSV-tiedoston käsittely epäonnistui.');
    }
  };

  const maxRows = Math.max(0, ...Object.values(columnData).map((column) => column.length));

  return (
    <main className="app">
      <h1>Saken tilastoindikaattorit</h1>
      <form className="upload" aria-label="CSV upload">
        <label htmlFor="csv-upload">Lataa CSV-tiedosto</label>
        <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} />
        <p className="upload-status" role="status">
          {uploadMessage}
        </p>
      </form>

      <section className="hint-table">

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
              {maxRows === 0 ? (
                <tr>
                  <td colSpan={columnHeadings.length} className="empty-state">
                    {uploadMessage}
                  </td>
                </tr>
              ) : (
                Array.from({ length: maxRows }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex}>
                      {columnHeadings.map((heading) => {
                        const cellContent = columnData[heading]?.[rowIndex] ?? '';
                        const ariaLabel = `${heading}${cellContent ? `: ${cellContent}` : ' (ei dataa)'}`;

                        return (
                          <td key={`${heading}-${rowIndex}`} aria-label={ariaLabel}>
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default App;
