import { Grid } from "./grid";
import { Tile } from "./tile";
import { getNextCoefficient, getBetAmount } from "../main";

import {
  setGameStarted,
  lockMineSelection,
  unlockMineSelection,
  resetMineSelection,
} from "../main";

export class Game {
  private grid: Grid;
  private mineCount: number = 1;
  private isGameActive: boolean = false;
  private revealedSafeTiles = 0;
  private startButton: HTMLButtonElement;
  private totalMultiplier = 1;

  constructor(
    private rows: number,
    private cols: number,
    initialMines: number
  ) {
    this.mineCount = initialMines;

    this.grid = new Grid(
      this.rows,
      this.cols,
      this.mineCount,
      "game-grid",
      this.handleTileClick.bind(this)
    );

    this.startButton = document.getElementById(
      "start-button"
    ) as HTMLButtonElement;
  }

  public setMineCount(count: number) {
    this.mineCount = count;
    this.grid.setMineCount(count);
  }

  public isActive() {
    return this.isGameActive;
  }

  public start() {
    this.totalMultiplier = 1;
    this.isGameActive = true;
    this.revealedSafeTiles = 0;
    this.startButton.querySelector(".button-label")!.textContent = "Cash Out";
    const winSpan = document.getElementById("win-inside-button")!;
    winSpan.classList.remove("hidden");
    this.grid.resetGrid();

    const betInfo = document.querySelector(".bet-info") as HTMLParagraphElement;
    if (betInfo) {
      betInfo.textContent = `${betInfo}`;
      betInfo.classList.remove("hidden");
    }

    lockMineSelection();
    setGameStarted(true);
  }

  public cashOut() {
    this.isGameActive = false;
    this.grid.revealAllTiles();
    this.updateWinAmountDisplay();
    this.startButton.querySelector(".button-label")!.textContent = "Bet";
    const winAmount = (this.betAmount * this.totalMultiplier).toFixed(2);
    this.showMessage(`You cashed out ${winAmount}$ !`);
    const winSpan = document.getElementById("win-inside-button")!;

    winSpan.classList.add("hidden");
    setTimeout(() => {
      this.grid.resetGrid();
      this.startButton.querySelector(".button-label")!.textContent = "Bet";
      this.startButton.disabled = false;

      resetMineSelection();
      unlockMineSelection();
      setGameStarted(false);
      const winSpan = document.getElementById("win-inside-button")!;
      winSpan.textContent = "";
      winSpan.classList.add("hidden");
      const betInfo = document.querySelector(
        ".bet-info"
      ) as HTMLParagraphElement;
      if (betInfo) {
        betInfo.textContent = "Bet USD";
        betInfo.classList.add("hidden");
      }

      this.clearMessage();
    }, 3000);
  }

  private handleTileClick(tile: Tile) {
    if (!this.isGameActive || tile.revealed) return;

    tile.reveal();

    if (tile.hasMine) {
      this.endGame();
    } else {
      const nextCoeff = getNextCoefficient(
        this.mineCount,
        this.revealedSafeTiles
      );
      this.totalMultiplier *= nextCoeff;
      this.revealedSafeTiles++;

      this.updateNextCoefficientDisplay();
      this.updateWinAmountDisplay();

      if (this.revealedSafeTiles >= 25 - this.mineCount) {
        this.cashOut();
      }
    }
  }
  private endGame() {
    this.totalMultiplier = 1;
    this.isGameActive = false;
    this.grid.revealAllTiles();
    this.showMessage("Game Over");
    const winSpan = document.getElementById("win-inside-button")!;
    winSpan.textContent = "";
    winSpan.classList.add("hidden");

    const betInfo = document.querySelector(".bet-info") as HTMLParagraphElement;
    if (betInfo) {
      betInfo.textContent = "";
      betInfo.classList.add("hidden");
    }

    setTimeout(() => {
      this.grid.resetGrid();
      this.startButton.querySelector(".button-label")!.textContent = "Bet";
      this.startButton.style.backgroundColor = "green";
      this.startButton.disabled = false;

      resetMineSelection();
      unlockMineSelection();
      setGameStarted(false);

      this.clearMessage();
    }, 4000);
  }

  private updateNextCoefficientDisplay() {
    const coeff = getNextCoefficient(this.mineCount, this.revealedSafeTiles);
    const coeffEl = document.querySelector(
      ".coefficient"
    ) as HTMLParagraphElement;
    if (coeffEl) {
      coeffEl.textContent = `Next: ${coeff.toFixed(2)}x`;
      coeffEl.classList.add("animate-flash");
      setTimeout(() => coeffEl.classList.remove("animate-flash"), 300);
    }
  }

  // private updateWinAmountDisplay() {
  //   const coeff = getNextCoefficient(
  //     this.mineCount,
  //     this.revealedSafeTiles - 1
  //   );
  //   const currentCoeff = coeff <= 1 ? 1.0 : coeff;
  //   const win = (this.betAmount * this.totalMultiplier).toFixed(2);
  //   const winSpan = document.getElementById("win-inside-button")!;
  //   winSpan.textContent = `${win}$`;
  //   winSpan.classList.remove("animate-win");
  //   void winSpan.offsetWidth;
  //   winSpan.classList.add("animate-win");
  //   const betInfo = document.querySelector(".bet-info") as HTMLParagraphElement;
  //   if (betInfo) {
  //     betInfo.textContent = `${win}$`;
  //     betInfo.classList.remove("hidden");
  //     betInfo.classList.remove("animate-win");
  //     void betInfo.offsetWidth;
  //     betInfo.classList.add("animate-win");
  //   }
  // }
  private updateWinAmountDisplay() {
    const win = (this.betAmount * this.totalMultiplier).toFixed(2);
    const multiplier = this.totalMultiplier.toFixed(2);

    const winSpan = document.getElementById("win-inside-button")!;
    winSpan.textContent = `${win}$ (x${multiplier})`;

    // Анимация
    winSpan.classList.remove("animate-win");
    void winSpan.offsetWidth;
    winSpan.classList.add("animate-win");

    const betInfo = document.querySelector(".bet-info") as HTMLParagraphElement;
    if (betInfo) {
      betInfo.textContent = `${win}$ (x${multiplier})`;
      betInfo.classList.remove("hidden");
      betInfo.classList.remove("animate-win");
      void betInfo.offsetWidth;
      betInfo.classList.add("animate-win");
    }
  }

  private showMessage(msg: string) {
    const popup = document.getElementById("popup");
    const messageEl = document.getElementById("popup-message");
    if (popup && messageEl) {
      messageEl.textContent = msg;
      popup.classList.remove("hidden");

      setTimeout(() => {
        popup.classList.add("hidden");
        messageEl.textContent = "";
      }, 3000);
    }
  }

  private clearMessage() {
    const messageEl = document.getElementById("popup-message");
    if (messageEl) messageEl.textContent = "";
  }

  private get betAmount() {
    return getBetAmount();
  }
}
