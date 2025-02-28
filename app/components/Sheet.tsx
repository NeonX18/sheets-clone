import React from "react";
import { useSheetStore } from "../store/useSheetStore";

const Sheet = () => {
  const rows = 50;
  const cols = 26;
  const {
    cells,
    formulas,
    selectedCell,
    setSelectedCell,
    setCell,
    setFormula,
    evaluateFormula,
  } = useSheetStore();

  const getCellLabel = (row: number, col: number) =>
    `${String.fromCharCode(65 + col)}${row + 1}`;

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell(getCellLabel(row, col));
  };

  const handleCellChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const cellKey = getCellLabel(row, col);
    const value = e.target.value;

    if (value.startsWith("=")) {
      setFormula(cellKey, value);
    } else {
      setCell(cellKey, value);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    if (e.key === "Enter") {
      const cellKey = getCellLabel(row, col);
      if (formulas[cellKey]) {
        setCell(cellKey, evaluateFormula(formulas[cellKey]));
      }
    }
  };

  return (
    <div className="relative flex flex-col w-[90vw] h-[80vh] border border-gray-300 shadow-lg">
      <div className="overflow-auto w-full h-full">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `40px repeat(${cols}, 80px)`,
            gridTemplateRows: `30px repeat(${rows}, 30px)`,
          }}
        >
          <div className="bg-gray-200 border border-gray-300 sticky top-0 left-0 z-20 shadow-md"></div>

          {Array.from({ length: cols }).map((_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className="bg-gray-100 border border-gray-300 text-center font-medium sticky top-0 z-10 shadow-md"
            >
              {String.fromCharCode(65 + colIndex)}
            </div>
          ))}

          {Array.from({ length: rows }).map((_, rowIndex) => (
            <React.Fragment key={`row-fragment-${rowIndex}`}>
              <div
                key={`row-${rowIndex}`}
                className="bg-gray-100 border border-gray-300 text-center font-medium sticky left-0 z-10 shadow-md"
              >
                {rowIndex + 1}
              </div>

              {Array.from({ length: cols }).map((_, colIndex) => {
                const cellKey = getCellLabel(rowIndex, colIndex);
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`relative p-2 border border-gray-300 text-center text-sm transition-all cursor-pointer ${
                      selectedCell === cellKey
                        ? "bg-yellow-200"
                        : "hover:bg-gray-100"
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {selectedCell === cellKey ? (
                      <input
                        type="text"
                        className="w-full h-full text-center focus:outline-none bg-transparent"
                        value={formulas[cellKey] || cells[cellKey] || ""}
                        onChange={(e) =>
                          handleCellChange(e, rowIndex, colIndex)
                        }
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        autoFocus
                      />
                    ) : formulas[cellKey] ? (
                      <span className="text-yellow-600">
                        {formulas[cellKey]}
                      </span>
                    ) : (
                      cells[cellKey] || ""
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sheet;
