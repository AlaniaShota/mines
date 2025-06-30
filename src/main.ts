// main.ts
import { Game } from "./classes/game";
import "./style.css";

const ROWS = 5;
const COLS = 5;
const MINES = 3;

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game(ROWS, COLS, MINES);
});
