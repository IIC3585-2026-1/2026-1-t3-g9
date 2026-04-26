window.Module = window.Module || {};

const GRID_SIZE = 9;
let wasmReady = false;
let setCell = null;
let validateGrid = null;
let solveBoard = null;
let getCell = null;

const form = document.getElementById("sudoku-form");
const board = document.getElementById("sudoku-board");
const cells = Array.from(board.querySelectorAll(".sudoku-cell"));
const resolveButton = document.getElementById("btn-resolver");
const resetButton = document.getElementById("btn-limpiar");
const runtimeStatus = document.getElementById("runtime-status");
const feedbackMessage = document.getElementById("feedback-message");

function setStatus(text) {
  runtimeStatus.textContent = text;
}

function setFeedback(text, tone = "neutral") {
  feedbackMessage.textContent = text;
  feedbackMessage.dataset.tone = tone;
}

function sanitizeCellValue(rawValue) {
  const digitsOnly = rawValue.replace(/[^0-9]/g, "");
  if (digitsOnly === "" || digitsOnly === "0") {
    return "";
  }

  return digitsOnly[0];
}

function readBoardFromInputs() {
  return cells.map((cell) => {
    const value = sanitizeCellValue(cell.value);
    cell.value = value;
    return value === "" ? 0 : Number(value);
  });
}

function writeSolvedBoard() {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const cell = document.getElementById(`cell-${row}-${col}`);
      const solvedValue = getCell(row, col);
      cell.value = String(solvedValue);
      if (!cell.classList.contains("is-original")) {
        cell.classList.add("is-solved");
      }
    }
  }
}

function clearSolvedMarks() {
  cells.forEach((cell) => {
    cell.classList.remove("is-solved");
  });
}

function loadBoardIntoWasm(boardValues) {
  for (let row = 0; row < GRID_SIZE; row += 1) {
    for (let col = 0; col < GRID_SIZE; col += 1) {
      setCell(row, col, boardValues[row * GRID_SIZE + col]);
    }
  }
}

function handleResolve() {
  if (!wasmReady) {
    setFeedback("El modulo WebAssembly todavia no esta listo.", "error");
    return;
  }

  clearSolvedMarks();

  const boardValues = readBoardFromInputs();
  loadBoardIntoWasm(boardValues);

  if (!validateGrid()) {
    setFeedback("El tablero inicial es invalido. Revisa filas, columnas y subgrillas.", "error");
    return;
  }

  const solved = solveBoard();
  if (!solved) {
    setFeedback("El Sudoku no tiene solucion con los valores ingresados.", "error");
    return;
  }

  writeSolvedBoard();
  setFeedback("Sudoku resuelto desde el modulo Wasm.", "success");
}

function handleReset() {
  window.requestAnimationFrame(() => {
    clearSolvedMarks();
    setFeedback("Tablero restaurado al estado inicial.", "neutral");
  });
}

cells.forEach((cell) => {
  cell.addEventListener("input", () => {
    cell.value = sanitizeCellValue(cell.value);
    if (!cell.classList.contains("is-original")) {
      cell.classList.remove("is-solved");
    }
  });
});

resolveButton.addEventListener("click", handleResolve);
resetButton.addEventListener("click", handleReset);
form.addEventListener("reset", handleReset);

window.Module.onAbort = () => {
  setStatus("Error al cargar Wasm");
  setFeedback("No se pudo cargar el modulo WebAssembly. Prueba ejecutando la pagina desde un servidor local.", "error");
};

window.Module.onRuntimeInitialized = () => {
  setCell = window.Module.cwrap("set_cell", null, ["number", "number", "number"]);
  validateGrid = window.Module.cwrap("validate_grid", "number", []);
  solveBoard = window.Module.cwrap("solve", "number", []);
  getCell = window.Module.cwrap("get_cell", "number", ["number", "number"]);

  wasmReady = true;
  setStatus("Wasm listo");
  setFeedback("Modulo WebAssembly cargado. Ya puedes resolver el tablero.", "success");
};
