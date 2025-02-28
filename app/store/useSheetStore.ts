import { create } from "zustand";

type SheetStore = {
  cells: Record<string, string>;
  formulas: Record<string, string>;
  selectedCell: string | null;
  setSelectedCell: (cell: string) => void;
  setCell: (cell: string, value: string) => void;
  setFormula: (cell: string, formula: string) => void;
  evaluateFormula: (formula: string) => string;
  getCellValue: (cell: string) => number;
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
    set((state) => ({
      formulas: { ...state.formulas, [cell]: formula },
      cells: { ...state.cells, [cell]: get().evaluateFormula(formula) },
    })),

  getCellValue: (cell) => {
    const value = get().cells[cell];
    return value && !isNaN(Number(value)) ? Number(value) : 0;
  },

  evaluateFormula: (formula) => {
    if (!formula.startsWith("=")) return formula;
    try {
      const expression = formula.slice(1).trim();

      const sumMatch = expression.match(/^SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/);
      if (sumMatch) {
        const [_, startCol, startRow, endCol, endRow] = sumMatch;
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

      const parsedExpression = expression.replace(
        /([A-Z]+)(\d+)/g,
        (_, col, row) => {
          const key = col + row;
          return get().getCellValue(key);
        }
      );

      return String(eval(parsedExpression));
    } catch {
      return "ERROR";
    }
  },
}));
