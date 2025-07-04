import { Game } from "./classes/Game";
import "./style.css";

export const coefficients: Record<number, number> = {
  1: 1.01,
  2: 1.05,
  3: 1.1,
  4: 1.15,
  5: 1.21,
  6: 1.27,
  7: 1.34,
  8: 1.48,
  9: 1.51,
  10: 1.61,
};

let selectedMines = 1;
let gameStarted = false;

const minesSelect = document.getElementById(
  "mines-select"
) as HTMLSelectElement;
const coefficientDisplay = document.querySelector(
  ".coefficient"
) as HTMLParagraphElement;

for (let i = 1; i <= 10; i++) {
  const option = document.createElement("option");
  option.value = i.toString();
  option.textContent = i.toString();
  minesSelect.appendChild(option);
}

minesSelect.value = "1";
coefficientDisplay.textContent = `Next: ${coefficients[1].toFixed(2)}x`;

minesSelect.addEventListener("change", (e) => {
  if (gameStarted) return;
  selectedMines = parseInt((e.target as HTMLSelectElement).value);
  const coefficient = coefficients[selectedMines] ?? 1.0;
  coefficientDisplay.textContent = `Next: ${coefficient.toFixed(2)}x`;
});

export function getSelectedMines() {
  return selectedMines;
}
export function setGameStarted(val: boolean) {
  gameStarted = val;
}
export function lockMineSelection() {
  minesSelect.disabled = true;
}
export function unlockMineSelection() {
  minesSelect.disabled = false;
}
export function resetMineSelection() {
  minesSelect.value = "1";
  selectedMines = 1;
  const coeff = coefficients[1];
  coefficientDisplay.textContent = `Next: ${coeff.toFixed(2)}x`;
}

let currentGame: Game;

window.addEventListener("DOMContentLoaded", () => {
  currentGame = new Game(5, 5, selectedMines);

  const startButton = document.getElementById(
    "start-button"
  ) as HTMLButtonElement;
  startButton.addEventListener("click", () => {
    if (currentGame.isActive()) {
      currentGame.cashOut();
    } else {
      currentGame.setMineCount(getSelectedMines());
      currentGame.start();
    }
  });
  updateBetDisplay();

  document.querySelector(".plus")?.addEventListener("click", () => {
    if (!gameStarted) increaseBet();
  });

  document.querySelector(".minus")?.addEventListener("click", () => {
    if (!gameStarted) decreaseBet();
  });

  const usdBtn = document.getElementById("usd");
  const customDropdown = document.getElementById("custom-dropdown");

  usdBtn?.addEventListener("click", (e) => {
    e.stopPropagation(); // чтобы не закрывало само себя
    customDropdown?.classList.toggle("show");
  });

  customDropdown?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("dropdown-option")) {
      const value = parseFloat(target.dataset.value || "0.1");
      betAmount = value;
      updateBetDisplay();
      customDropdown.classList.remove("show");
    }
  });
  document.addEventListener("click", (e) => {
    const isClickInside =
      customDropdown?.contains(e.target as Node) ||
      usdBtn?.contains(e.target as Node);
    if (!isClickInside) {
      customDropdown?.classList.remove("show");
    }
  });
});
export function getNextCoefficient(
  mines: number,
  revealedSafeTiles: number
): number {
  const totalTiles = 25;
  const remainingTiles = totalTiles - revealedSafeTiles;
  const remainingSafeTiles = remainingTiles - mines;

  if (remainingTiles <= 0 || remainingSafeTiles <= 0) return 0;

  const nextCoeff = remainingTiles / remainingSafeTiles;

  return parseFloat(nextCoeff.toFixed(2));
}

let betAmount = 0.3;

export function getBetAmount() {
  return betAmount;
}

function updateBetDisplay() {
  const priceEl = document.querySelector(".bet-price") as HTMLParagraphElement;
  if (priceEl) {
    priceEl.textContent = betAmount.toFixed(2);
    priceEl.classList.add("animate-flash");
    setTimeout(() => priceEl.classList.remove("animate-flash"), 300);
  }
}

// function increaseBet() {
//   betAmount = Math.min(10, betAmount + 0.1);
//   updateBetDisplay();
// }

// function decreaseBet() {
//   betAmount = Math.max(0.1, betAmount - 0.1);
//   updateBetDisplay();
// }

function increaseBet() {
  betAmount = Math.min(100, +(betAmount + 0.1).toFixed(2));
  updateBetDisplay();
}

function decreaseBet() {
  betAmount = Math.max(0.1, +(betAmount - 0.1).toFixed(2));
  updateBetDisplay();
}

const plusBtn = document.getElementById("plus");
const minusBtn = document.getElementById("minus");
const usdBtn = document.getElementById("usd");
const dropdown = document.getElementById("bet-dropdown") as HTMLSelectElement;

plusBtn?.addEventListener("click", () => {
  if (!gameStarted) {
    increaseBet();
  }
});

minusBtn?.addEventListener("click", () => {
  if (!gameStarted) {
    decreaseBet();
  }
});

usdBtn?.addEventListener("click", () => {
  dropdown.classList.toggle("hidden");
});

dropdown?.addEventListener("change", (e) => {
  if (!gameStarted) {
    betAmount = parseFloat((e.target as HTMLSelectElement).value);
    updateBetDisplay();
  }
});
