import { Grid } from "./grid";
import { Tile } from "./tile";

export class Game {
  private grid!: Grid;
  private readonly rows: number;
  private readonly cols: number;
  private readonly mineCount: number;
  private isGameActive: boolean = false;

  constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;

    this.initGrid();
    this.initializeStartButton();
  }

  private initGrid() {
    this.grid = new Grid(
      this.rows,
      this.cols,
      this.mineCount,
      "game-grid",
      this.handleTileClick.bind(this)
    );
  }

  private initializeStartButton() {
    const startButton = document.getElementById(
      "start-button"
    ) as HTMLButtonElement;
    if (!startButton) throw new Error("Start button not found");

    startButton.addEventListener("click", () => {
      this.start();
      startButton.disabled = true;
      startButton.classList.add("disabled");
    });
  }

  public start() {
    if (!this.grid) {
      console.error("Grid not initialized");
      return;
    }

    this.isGameActive = true;
    this.grid.resetGrid();
    this.clearMessage();
    console.log("Game started.");
  }

  private handleTileClick(tile: Tile) {
    if (!this.isGameActive || tile.revealed) return;

    tile.reveal();

    if (tile.hasMine) {
      this.endGame(false);
    }
  }

  private endGame(won: boolean) {
    this.isGameActive = false;

    this.grid.revealAllTiles();

    setTimeout(() => {
      this.showMessage("Game Over");
      setTimeout(() => {
        location.reload();
      }, 3000);
    }, 5000);
  }

  private showMessage(msg: string) {
    const popup = document.getElementById("popup");
    const messageEl = document.getElementById("popup-message");

    if (popup && messageEl) {
      messageEl.textContent = msg;
      popup.classList.remove("hidden");
    }
  }

  private clearMessage() {
    const messageEl = document.getElementById("message");
    if (messageEl) {
      messageEl.textContent = "";
      messageEl.classList.remove("visible");
    }
  }
}
