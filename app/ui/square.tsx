type SquareProps = {
  squareId: number; // Eine eindeutige ID für das Square
  clicks: number; // Anzahl der Klicks
  onClick: () => void; // Klick-Handler
};

const getColor = (clicks: number) => {
  switch (clicks) {
    case 1:
      return "bg-green-100 dark:bg-green-900";
    case 2:
      return "bg-green-400 dark:bg-green-700";
    case 3:
      return "bg-green-700 dark:bg-green-500";
    default:
      return "bg-white dark:bg-gray-800";
  }
};

const updateClickCount = () => {};

const handleClick = () => {};

const Square: React.FC<SquareProps> = ({ squareId, clicks, onClick }) => {
  return (
    <div
      className={`w-12 h-12 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer transition-all duration-200 ${getColor(
        clicks
      )}`}
      onClick={onClick}
      title={`Klicks: ${clicks}`}
    />
  );
};

export default Square;
