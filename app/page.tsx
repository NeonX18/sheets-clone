"use client";

import Toolbar from "./components/Toolbar";
import FormulaBar from "./components/FormulaBar";
import Sheet from "./components/Sheet";
import { useSheetStore } from "./store/useSheetStore";
import { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function Home() {
  const { cells, setCell } = useSheetStore();
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);

  const getCellLabel = (row: number, col: number) =>
    `${String.fromCharCode(65 + col)}${row + 1}`;

  return (
    <DndProvider backend={HTML5Backend}>
      <main className="flex flex-col min-h-screen bg-gray-200">
        <Toolbar />
        <FormulaBar
          selectedCell={
            selectedCell
              ? getCellLabel(selectedCell.row, selectedCell.col)
              : null
          }
          cellValue={
            selectedCell
              ? cells[getCellLabel(selectedCell.row, selectedCell.col)] || ""
              : ""
          }
          onFormulaChange={(value) => {
            if (selectedCell) {
              setCell(getCellLabel(selectedCell.row, selectedCell.col), value);
            }
          }}
        />
        <div className="flex-1 overflow-auto p-6 flex justify-center">
          <Sheet
            selectedCell={selectedCell}
            setSelectedCell={setSelectedCell}
          />
        </div>
      </main>
    </DndProvider>
  );
}
