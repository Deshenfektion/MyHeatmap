// lib/column.tsx
import Row from "./row";

type ColumnProps = {
  rows: number; // Anzahl der Zeilen
  cols: number; // Anzahl der Spalten
  clicks: number[][]; // 2D Array der Klicks
  handleClick: (row: number, col: number) => void; // Funktion, die aufgerufen wird, wenn ein Quadrat angeklickt wird
};

const Column: React.FC<ColumnProps> = ({ rows, cols, clicks, handleClick }) => {
  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: rows }, (_, rowIndex) => (
        <Row
          key={`row-${rowIndex}`}
          rowIndex={rowIndex}
          cols={cols}
          clicks={clicks}
          handleClick={handleClick}
        />
      ))}
    </div>
  );
};

export default Column;
