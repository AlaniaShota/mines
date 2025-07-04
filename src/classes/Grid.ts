import { Tile } from "./Tile";

export class Grid {
  private tiles: Tile[][] = [];

  private rows: number;
  private cols: number;
  private mineCount: number;
  private containerId: string;
  private onTileClick: (tile: Tile) => void;

  constructor(
    rows: number,
    cols: number,
    mineCount: number,
    containerId: string,
    onTileClick: (tile: Tile) => void
  ) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
    this.containerId = containerId;
    this.onTileClick = onTileClick;

    this.generateGrid();
  }

  private generateGrid() {
    const container = document.getElementById(this.containerId);
    if (!container) throw new Error("Grid container not found");

    container.innerHTML = "";
    container.style.display = "grid";
    container.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
    container.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;

    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        const tile = new Tile(row, col, this.onTileClick);
        this.tiles[row][col] = tile;
        container.appendChild(tile.getElement());
      }
    }
  }

  public setMineCount(count: number) {
    this.mineCount = count;
  }

  private placeMines() {
    let placed = 0;
    while (placed < this.mineCount) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.cols);
      const tile = this.tiles[r][c];
      if (!tile.hasMine) {
        tile.setMine();
        placed++;
      }
    }
  }

  resetGrid() {
    for (const row of this.tiles) {
      for (const tile of row) {
        tile.reset();
      }
    }
    this.placeMines();
  }

  revealAllTiles() {
    for (const row of this.tiles) {
      for (const tile of row) {
        if (!tile.revealed) tile.reveal();
      }
    }
  }
}
