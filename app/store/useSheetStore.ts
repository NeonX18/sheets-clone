/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from "zustand";

type SheetStore = {
  cells: Record<string, string>;
  formulas: Record<string, string>;
  selectedCell: string | null;
  setSelectedCell: (cell: string) => void;
  setCell: (cell: string, value: string) => void;
  setFormula: (cell: string, formula: string) => void;
  evaluateFormula: (cell: string, formula: string) => string;
  getCellValue: (cell: string) => number;
  recalculateCells: () => void;
};

export const useSheetStore = create<SheetStore>((set, get) => ({
  cells: {},
  formulas: {},
  selectedCell: null,

  setSelectedCell: (cell) => set({ selectedCell: cell }),

  setCell: (cell, value) =>
    set((state) => ({
      cells: { ...state.cells, [cell]: value },
      formulas: { ...state.formulas, [cell]: "" },
    })),

  setFormula: (cell, formula) =>
    set((state) => {
      const newFormulas = { ...state.formulas, [cell]: formula };
      const newCells = {
        ...state.cells,
        [cell]: get().evaluateFormula(cell, formula),
      };
      return { formulas: newFormulas, cells: newCells };
    }),

  getCellValue: (cell) => {
    const value = get().cells[cell];
    return value && !isNaN(Number(value)) ? Number(value) : 0;
  },

  evaluateFormula: (cell, formula) => {
    if (!formula.startsWith("=")) return formula;
    try {
      const expression = formula.slice(1).trim();

      // Handling SUM(A1:A3) properly
      const sumMatch = expression.match(/^SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
      if (sumMatch) {
        const [, startCol, startRow, endCol, endRow] = sumMatch;
        const startColumn = startCol.charCodeAt(0) - 65;
        const endColumn = endCol.charCodeAt(0) - 65;
        const startRowNum = parseInt(startRow, 10);
        const endRowNum = parseInt(endRow, 10);
        let sum = 0;

        for (let row = startRowNum; row <= endRowNum; row++) {
          for (let col = startColumn; col <= endColumn; col++) {
            const key = `${String.fromCharCode(65 + col)}${row}`;
            sum += get().getCellValue(key);
          }
        }
        return String(sum);
      }

      // Replace cell references (e.g., A1, B2) with their numeric values
      const parsedExpression = expression.replace(
        /([A-Z]+)(\d+)/g,
        (_: string, col: string, row: string) => {
          const key = col + row;
          return String(get().getCellValue(key)); // Convert number to string
        }
      );

      return String(eval(parsedExpression));
    } catch {
      return "ERROR";
    }
  },

  recalculateCells: () => {
    set((state) => {
      const newCells = { ...state.cells };
      for (const cell in state.formulas) {
        if (state.formulas[cell]) {
          newCells[cell] = get().evaluateFormula(cell, state.formulas[cell]);
        }
      }
      return { cells: newCells };
    });
  },
}));
