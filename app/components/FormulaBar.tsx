import React from "react";
import { useSheetStore } from "../store/useSheetStore";

const FormulaBar = () => {
  const {
    selectedCell,
    cells,
    formulas,
    setFormula,
    setCell,
    evaluateFormula,
  } = useSheetStore();

  const handleFormulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedCell) return;
    const value = e.target.value;

    if (value.startsWith("=")) {
      setFormula(selectedCell, value);
    } else {
      setCell(selectedCell, value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && selectedCell && formulas[selectedCell]) {
      setCell(selectedCell, evaluateFormula(formulas[selectedCell]));
    }
  };

  return (
    <div className="p-2 bg-white border-b border-gray-300">
      <input
        type="text"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={
          selectedCell
            ? formulas[selectedCell] || cells[selectedCell] || ""
            : ""
        }
        onChange={handleFormulaChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter formula or value..."
      />
    </div>
  );
};

export default FormulaBar;
